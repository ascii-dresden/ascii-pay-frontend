package com.ascii.terminal;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // Whether our activity is currently in the foreground. NfcWakeService reads
    // this to decide whether it needs to pull the app forward on a tag (it only
    // acts while we're backgrounded; otherwise the JS layer handles everything).
    private static volatile boolean foreground = false;

    public static boolean isForeground() {
        return foreground;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(KioskPlugin.class);
        super.onCreate(savedInstanceState);

        // The NFC reader can report a tag while the app is in the background. To pull
        // ourselves to the foreground from there, Android 10+ requires the
        // "Display over other apps" (SYSTEM_ALERT_WINDOW) permission. It cannot be
        // auto-granted, so send the operator to grant it once on first launch.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }

        // Native reader connection that can wake the app even after the system
        // has frozen the backgrounded WebView.
        Intent service = new Intent(this, NfcWakeService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(service);
        } else {
            startService(service);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        foreground = true;
    }

    @Override
    public void onPause() {
        foreground = false;
        super.onPause();
    }
}
