package com.ascii.terminal;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.view.WindowManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.util.Collections;
import java.util.List;

/**
 * Small kiosk helper plugin.
 *
 * <ul>
 *   <li>{@code wake()} – turn the screen on and show the (already running) app over a
 *       non-secure keyguard when a tag is read via the websocket NFC reader. Replaces the
 *       deprecated cordova-plugin-background-mode wake path which no longer works on
 *       Android 10+ / One UI.</li>
 *   <li>{@code openApp({ packageNames })} – bring an already installed app (e.g. SumUp) to
 *       the foreground without closing this app.</li>
 * </ul>
 */
@CapacitorPlugin(name = "Kiosk")
public class KioskPlugin extends Plugin {

    private static final String TAG = "Kiosk";

    @PluginMethod
    public void wake(PluginCall call) {
        final Activity activity = getActivity();
        if (activity == null) {
            Log.w(TAG, "wake() rejected: no activity");
            call.reject("No activity");
            return;
        }

        boolean canOverlay = Build.VERSION.SDK_INT < Build.VERSION_CODES.M
                || Settings.canDrawOverlays(activity);
        Log.i(TAG, "wake() called; canDrawOverlays=" + canOverlay);

        activity.runOnUiThread(() -> {
            // Show this activity over the (non-secure) lock screen and turn the screen on.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) { // API 27
                activity.setShowWhenLocked(true);
                activity.setTurnScreenOn(true);
            }
            activity.getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

            // Belt-and-suspenders: force the display on for devices that ignore the
            // window flags when the activity is already created but the screen is off.
            PowerManager pm = (PowerManager) activity.getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                @SuppressWarnings("deprecation")
                PowerManager.WakeLock wl = pm.newWakeLock(
                        PowerManager.SCREEN_BRIGHT_WAKE_LOCK |
                        PowerManager.ACQUIRE_CAUSES_WAKEUP |
                        PowerManager.ON_AFTER_RELEASE,
                        "kiosk:wake");
                // Auto-releases after the timeout; FLAG_KEEP_SCREEN_ON keeps it on afterwards.
                wl.acquire(5000);
            }

            // Bring our task to the front. NEW_TASK is required when the app is in the
            // background (e.g. the launcher or SumUp is in front); this background
            // activity start is only allowed because we hold SYSTEM_ALERT_WINDOW
            // ("Display over other apps"). Without that permission Android 10+ silently
            // blocks it and the app stays in the background.
            Intent launch = activity.getPackageManager()
                    .getLaunchIntentForPackage(activity.getPackageName());
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                        Intent.FLAG_ACTIVITY_REORDER_TO_FRONT |
                        Intent.FLAG_ACTIVITY_SINGLE_TOP);
                try {
                    activity.startActivity(launch);
                    Log.i(TAG, "wake() startActivity invoked (foreground requested)");
                } catch (Exception e) {
                    Log.e(TAG, "wake() startActivity threw", e);
                }
            } else {
                Log.w(TAG, "wake() no launch intent for package");
            }

            // Dismiss a non-secure keyguard (swipe-to-unlock). A secure lock cannot be
            // bypassed; on such devices this is a no-op and the app stays over the lock.
            KeyguardManager km = (KeyguardManager) activity.getSystemService(Context.KEYGUARD_SERVICE);
            if (km != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                km.requestDismissKeyguard(activity, null);
            }

            call.resolve();
        });
    }

    @PluginMethod
    public void openApp(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("No activity");
            return;
        }

        JSArray names = call.getArray("packageNames");
        List<String> packages;
        try {
            packages = names != null ? names.<String>toList() : Collections.<String>emptyList();
        } catch (JSONException e) {
            call.reject("Invalid packageNames");
            return;
        }

        for (String pkg : packages) {
            Intent launch = activity.getPackageManager().getLaunchIntentForPackage(pkg);
            if (launch != null) {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(launch);
                JSObject ret = new JSObject();
                ret.put("opened", pkg);
                call.resolve(ret);
                return;
            }
        }

        call.reject("No matching app installed");
    }
}
