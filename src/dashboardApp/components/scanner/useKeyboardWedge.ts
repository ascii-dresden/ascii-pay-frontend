import React from "react";

const MAX_KEY_GAP_MS = 50;
const MIN_CODE_LENGTH = 6;

const isTextInputFocused = (): boolean => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) {
    return false;
  }
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  return el.isContentEditable;
};

/**
 * Listens for keyboard-wedge barcode scanners (USB/Bluetooth scanners that
 * type the code very fast and finish with Enter) while no text input has
 * focus. Fast keystrokes (< 50 ms apart, at least 6 characters) that end
 * with Enter are reported as one code.
 */
export function useKeyboardWedge(
  onCode: (code: string) => void,
  enabled: boolean = true
) {
  const onCodeRef = React.useRef(onCode);
  onCodeRef.current = onCode;

  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    let buffer = "";
    let lastTime = 0;

    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      if (isTextInputFocused()) {
        buffer = "";
        return;
      }
      const now = Date.now();
      if (now - lastTime > MAX_KEY_GAP_MS) {
        buffer = "";
      }
      lastTime = now;

      if (e.key === "Enter") {
        if (buffer.length >= MIN_CODE_LENGTH) {
          e.preventDefault();
          const code = buffer;
          buffer = "";
          onCodeRef.current(code);
        } else {
          buffer = "";
        }
        return;
      }
      if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled]);
}
