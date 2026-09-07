import React from "react";

export type BarcodeScannerStatus = "idle" | "starting" | "scanning" | "error";

export type BarcodeScannerError =
  | "insecure"
  | "unsupported"
  | "denied"
  | "notFound"
  | "unknown";

export type BarcodeScannerEngine = "native" | "zxing" | null;

/** Formats we care about (native BarcodeDetector names). */
export const SCANNER_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
  "qr_code",
] as const;

// The BarcodeDetector API is not part of TypeScript's DOM lib yet.
type NativeDetectedBarcode = { rawValue: string; format: string };
type NativeBarcodeDetector = {
  detect: (source: ImageBitmapSource) => Promise<NativeDetectedBarcode[]>;
};
type NativeBarcodeDetectorCtor = {
  new (options?: { formats?: string[] }): NativeBarcodeDetector;
  getSupportedFormats?: () => Promise<string[]>;
};

const getNativeDetectorCtor = (): NativeBarcodeDetectorCtor | null => {
  const ctor = (window as unknown as { BarcodeDetector?: unknown })
    .BarcodeDetector;
  return typeof ctor === "function"
    ? (ctor as NativeBarcodeDetectorCtor)
    : null;
};

const NATIVE_DETECT_INTERVAL_MS = 150;

export type UseBarcodeScannerOptions = {
  onDetected: (code: string, format?: string) => void;
  /** Identical codes within this window are reported only once. */
  debounceMs?: number;
  /** Vibrate on a successful decode (default true). */
  vibrate?: boolean;
};

export type UseBarcodeScannerResult = {
  videoRef: React.RefObject<HTMLVideoElement>;
  status: BarcodeScannerStatus;
  error: BarcodeScannerError | null;
  engine: BarcodeScannerEngine;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

const isSecure = () =>
  typeof window !== "undefined" &&
  (window.isSecureContext ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const hasCameraApi = () =>
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function";

const mapMediaError = (e: unknown): BarcodeScannerError => {
  const name = (e as { name?: string } | null)?.name ?? "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "OverconstrainedError":
    case "DevicesNotFoundError":
      return "notFound";
    default:
      return "unknown";
  }
};

/**
 * Camera based barcode scanner. Uses the native `BarcodeDetector` when the
 * browser offers one and lazily loads `@zxing/browser` otherwise.
 */
export function useBarcodeScanner(
  options: UseBarcodeScannerOptions
): UseBarcodeScannerResult {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [status, setStatus] = React.useState<BarcodeScannerStatus>("idle");
  const [error, setError] = React.useState<BarcodeScannerError | null>(null);
  const [engine, setEngine] = React.useState<BarcodeScannerEngine>(null);

  const onDetectedRef = React.useRef(options.onDetected);
  onDetectedRef.current = options.onDetected;
  const debounceMs = options.debounceMs ?? 1500;
  const vibrate = options.vibrate ?? true;

  const streamRef = React.useRef<MediaStream | null>(null);
  const nativeTimerRef = React.useRef<number | null>(null);
  const zxingControlsRef = React.useRef<{ stop: () => void } | null>(null);
  const runIdRef = React.useRef(0);
  const lastHitRef = React.useRef<{ code: string; time: number } | null>(null);

  const handleHit = React.useCallback(
    (code: string, format?: string) => {
      const trimmed = code.trim();
      if (!trimmed) {
        return;
      }
      const now = Date.now();
      const last = lastHitRef.current;
      if (last && last.code === trimmed && now - last.time < debounceMs) {
        return;
      }
      lastHitRef.current = { code: trimmed, time: now };
      if (vibrate) {
        try {
          navigator.vibrate?.(50);
        } catch {
          // ignore
        }
      }
      onDetectedRef.current(trimmed, format);
    },
    [debounceMs, vibrate]
  );

  const stop = React.useCallback(() => {
    runIdRef.current += 1;
    if (nativeTimerRef.current !== null) {
      window.clearTimeout(nativeTimerRef.current);
      nativeTimerRef.current = null;
    }
    if (zxingControlsRef.current) {
      try {
        zxingControlsRef.current.stop();
      } catch {
        // ignore
      }
      zxingControlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch {
        // ignore
      }
      video.srcObject = null;
    }
    setStatus("idle");
  }, []);

  const start = React.useCallback(async () => {
    stop();
    setError(null);

    if (!isSecure()) {
      setError("insecure");
      setStatus("error");
      return;
    }
    if (!hasCameraApi()) {
      setError("unsupported");
      setStatus("error");
      return;
    }

    const runId = ++runIdRef.current;
    setStatus("starting");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
    } catch (e) {
      if (runId !== runIdRef.current) {
        return;
      }
      setError(mapMediaError(e));
      setStatus("error");
      return;
    }

    if (runId !== runIdRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    streamRef.current = stream;

    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setError("unknown");
      setStatus("error");
      return;
    }
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    video.muted = true;
    try {
      await video.play();
    } catch {
      // Autoplay restrictions; the stream is still attached.
    }
    if (runId !== runIdRef.current) {
      return;
    }

    // 1. Native detector
    const NativeCtor = getNativeDetectorCtor();
    if (NativeCtor) {
      try {
        let formats: string[] = [...SCANNER_FORMATS];
        if (NativeCtor.getSupportedFormats) {
          const supported = await NativeCtor.getSupportedFormats();
          formats = formats.filter((f) => supported.includes(f));
        }
        if (runId !== runIdRef.current) {
          return;
        }
        if (formats.length > 0) {
          const detector = new NativeCtor({ formats });
          setEngine("native");
          setStatus("scanning");
          const tick = async () => {
            if (runId !== runIdRef.current) {
              return;
            }
            const v = videoRef.current;
            if (v && v.readyState >= 2) {
              try {
                const codes = await detector.detect(v);
                if (runId !== runIdRef.current) {
                  return;
                }
                if (codes.length > 0) {
                  handleHit(codes[0].rawValue, codes[0].format);
                }
              } catch (e) {
                console.warn("BarcodeDetector.detect failed", e);
              }
            }
            if (runId === runIdRef.current) {
              nativeTimerRef.current = window.setTimeout(
                tick,
                NATIVE_DETECT_INTERVAL_MS
              );
            }
          };
          nativeTimerRef.current = window.setTimeout(
            tick,
            NATIVE_DETECT_INTERVAL_MS
          );
          return;
        }
      } catch (e) {
        console.warn("Native BarcodeDetector unavailable, using zxing", e);
      }
    }

    // 2. ZXing fallback (loaded on demand)
    try {
      const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] =
        await Promise.all([import("@zxing/browser"), import("@zxing/library")]);
      if (runId !== runIdRef.current) {
        return;
      }
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.QR_CODE,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);
      const reader = new BrowserMultiFormatReader(hints, {
        delayBetweenScanAttempts: 120,
        delayBetweenScanSuccess: 400,
      });
      const controls = await reader.decodeFromStream(
        stream,
        video,
        (result) => {
          if (runId !== runIdRef.current) {
            return;
          }
          if (result) {
            handleHit(result.getText(), String(result.getBarcodeFormat()));
          }
        }
      );
      if (runId !== runIdRef.current) {
        controls.stop();
        return;
      }
      zxingControlsRef.current = controls;
      setEngine("zxing");
      setStatus("scanning");
    } catch (e) {
      console.error("Could not start zxing scanner", e);
      if (runId !== runIdRef.current) {
        return;
      }
      stop();
      setError("unsupported");
      setStatus("error");
    }
  }, [handleHit, stop]);

  React.useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    videoRef,
    status,
    error,
    engine,
    isSupported: isSecure() && hasCameraApi(),
    start,
    stop,
  };
}
