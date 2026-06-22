package com.ascii.terminal;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONObject;

import java.net.URI;

/**
 * Keeps a connection to the websocket NFC reader alive in a native foreground
 * service and pulls the app to the foreground when a tag is presented.
 *
 * <p>The JS app owns the reader flow while it is visible, but Android freezes a
 * backgrounded WebView after a few minutes (e.g. while SumUp is in front), at
 * which point the WebView never sees the reader's message and {@code wakeUp()}
 * is never called. This service runs independently of the WebView, so a tag can
 * still wake the app even when its JS has been frozen for an hour. It only acts
 * while the app is <em>not</em> in the foreground; otherwise it stays out of the
 * way and lets the JS layer drive everything as before.
 */
public class NfcWakeService extends Service {

    private static final String TAG = "NfcWake";
    private static final String WS_URL = "ws://10.3.141.1:9001/";
    private static final String CHANNEL_ID = "nfc-wake";
    private static final int NOTIFICATION_ID = 0x4e6663; // "Nfc"

    private WebSocketClient client;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean shuttingDown = false;
    private PowerManager.WakeLock cpuLock;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground(NOTIFICATION_ID, buildNotification());

        // Keep the CPU running so our reader socket keeps ticking while the
        // screen is off / the app is backgrounded.
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        if (pm != null) {
            cpuLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "kiosk:nfc-reader");
            cpuLock.setReferenceCounted(false);
            cpuLock.acquire();
        }

        connect();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Restart the service if the system kills it.
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        shuttingDown = true;
        if (client != null) {
            try {
                client.close();
            } catch (Exception ignored) {
            }
            client = null;
        }
        if (cpuLock != null && cpuLock.isHeld()) {
            cpuLock.release();
        }
        super.onDestroy();
    }

    private void connect() {
        if (shuttingDown) {
            return;
        }

        URI uri;
        try {
            uri = new URI(WS_URL);
        } catch (Exception e) {
            Log.e(TAG, "invalid reader url", e);
            return;
        }

        client = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake handshake) {
                Log.i(TAG, "reader socket open");
            }

            @Override
            public void onMessage(String message) {
                handleMessage(message);
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                Log.i(TAG, "reader socket closed (" + code + "): " + reason);
                scheduleReconnect();
            }

            @Override
            public void onError(Exception ex) {
                Log.w(TAG, "reader socket error: " + ex.getMessage());
            }
        };

        // WS-level ping/pong: drop and rebuild a half-open ("zombie") socket the
        // OS never reported as closed. The backend ignores empty/ping frames.
        client.setConnectionLostTimeout(20);
        client.connect();
    }

    private void scheduleReconnect() {
        if (shuttingDown) {
            return;
        }
        handler.postDelayed(this::connect, 2000);
    }

    private void handleMessage(String message) {
        String type;
        try {
            type = new JSONObject(message).optString("type", "");
        } catch (Exception e) {
            return;
        }

        // Only a card / scan / deliberate input should pull the app forward —
        // never card-removed, errors, or the intermediate challenge/response
        // frames of a handshake.
        switch (type) {
            case "NfcIdentifyRequest":
            case "BarcodeIdentifyRequest":
            case "ReceiveKeyboardEvent":
            case "ReceiveSessionToken":
            case "ReceiveUnregisteredNfcCard":
                break;
            default:
                return;
        }

        // While the app is visible the JS layer owns the reader flow and the
        // wake. Only step in when we're backgrounded — exactly when the WebView
        // is frozen and the JS can't react.
        if (MainActivity.isForeground()) {
            return;
        }

        Log.i(TAG, "wake on reader message: " + type);
        wakeToForeground();
    }

    private void wakeToForeground() {
        handler.post(() -> {
            // Turn the screen on (no-op if already on). The activity itself
            // carries android:showWhenLocked / turnScreenOn, so it surfaces over
            // a non-secure keyguard on its own.
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (pm != null) {
                @SuppressWarnings("deprecation")
                PowerManager.WakeLock wl = pm.newWakeLock(
                        PowerManager.SCREEN_BRIGHT_WAKE_LOCK |
                                PowerManager.ACQUIRE_CAUSES_WAKEUP |
                                PowerManager.ON_AFTER_RELEASE,
                        "kiosk:nfc-wake");
                wl.acquire(3000);
            }

            // Bring our task to the front. Allowed from the background because the
            // app holds SYSTEM_ALERT_WINDOW ("Display over other apps").
            Intent launch = getPackageManager().getLaunchIntentForPackage(getPackageName());
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                        Intent.FLAG_ACTIVITY_REORDER_TO_FRONT |
                        Intent.FLAG_ACTIVITY_SINGLE_TOP);
                try {
                    startActivity(launch);
                    Log.i(TAG, "startActivity invoked (foreground requested)");
                } catch (Exception e) {
                    Log.e(TAG, "startActivity failed", e);
                }
            }
        });
    }

    private Notification buildNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "NFC reader", NotificationManager.IMPORTANCE_MIN);
            channel.setDescription("Keeps the NFC reader connection alive.");
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }
        }

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);

        return builder
                .setContentTitle("Ascii-Pay")
                .setContentText("NFC reader active")
                .setSmallIcon(getApplicationInfo().icon)
                .setOngoing(true)
                .build();
    }
}
