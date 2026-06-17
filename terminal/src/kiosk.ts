import { registerPlugin } from "@capacitor/core";

export interface KioskPlugin {
  /** Turn the screen on and show the app over a non-secure lock screen. */
  wake(): Promise<void>;
  /** Bring the first installed app from `packageNames` to the foreground. */
  openApp(options: { packageNames: string[] }): Promise<{ opened: string }>;
}

export const Kiosk = registerPlugin<KioskPlugin>("Kiosk");

/**
 * Known SumUp Android package names, tried in order. The currently shipping
 * "SumUp: Payments and POS" app is `com.kaching.merchant`; older installs use
 * `com.sumup.merchant`, and the consumer app is `com.sumup.pay`.
 */
export const SUMUP_PACKAGES = [
  "com.kaching.merchant",
];
