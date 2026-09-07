import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { QrCodeScanner, StopCircleOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { BarcodeScannerError, useBarcodeScanner } from "./useBarcodeScanner";

const errorKey = (error: BarcodeScannerError): string => {
  switch (error) {
    case "insecure":
      return "scanner.errorInsecure";
    case "unsupported":
      return "scanner.errorUnsupported";
    case "denied":
      return "scanner.errorDenied";
    case "notFound":
      return "scanner.errorNotFound";
    default:
      return "scanner.errorUnknown";
  }
};

export const BarcodeScanner = (props: {
  onDetected: (code: string, format?: string) => void;
  /** Start the camera as soon as the component mounts. */
  autoStart?: boolean;
  /** Pause decoding (e.g. while a sheet is open) without stopping the camera. */
  paused?: boolean;
  /** Stop the camera when this turns false (e.g. tab hidden). */
  active?: boolean;
  maxHeight?: number | string;
}) => {
  const { t } = useTranslation();
  const pausedRef = React.useRef(props.paused ?? false);
  pausedRef.current = props.paused ?? false;
  const onDetected = props.onDetected;

  const handleDetected = React.useCallback(
    (code: string, format?: string) => {
      if (pausedRef.current) {
        return;
      }
      onDetected(code, format);
    },
    [onDetected]
  );

  const { videoRef, status, error, engine, start, stop } = useBarcodeScanner({
    onDetected: handleDetected,
  });

  const autoStart = props.autoStart ?? false;
  const active = props.active ?? true;

  React.useEffect(() => {
    if (autoStart && active) {
      start().catch(console.error);
    }
    if (!active) {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, active]);

  const running = status === "starting" || status === "scanning";

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          maxHeight: props.maxHeight ?? "55vh",
          bgcolor: "black",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {status === "scanning" ? (
          <Box
            sx={{
              position: "absolute",
              left: "10%",
              right: "10%",
              top: "30%",
              bottom: "30%",
              border: "2px solid rgba(255,255,255,0.85)",
              borderRadius: 2,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.25)",
              pointerEvents: "none",
            }}
          />
        ) : null}
        {status === "starting" ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : null}
        {status === "idle" ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <QrCodeScanner sx={{ fontSize: 72 }} />
          </Box>
        ) : null}
        {status === "scanning" && engine ? (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: 8,
              bottom: 4,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {engine === "native"
              ? t("scanner.engineNative")
              : t("scanner.engineZxing")}
          </Typography>
        ) : null}
      </Box>

      {status === "error" && error ? (
        <Alert severity="error" sx={{ mt: 1 }}>
          {t(errorKey(error))}
        </Alert>
      ) : null}
      {status === "scanning" ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, textAlign: "center" }}
        >
          {t("scanner.scanning")}
        </Typography>
      ) : null}

      <Button
        variant={running ? "outlined" : "contained"}
        color={running ? "inherit" : "primary"}
        size="large"
        fullWidth
        sx={{ mt: 1.5, py: 1.5 }}
        startIcon={running ? <StopCircleOutlined /> : <QrCodeScanner />}
        onClick={() => {
          if (running) {
            stop();
          } else {
            start().catch(console.error);
          }
        }}
      >
        {running ? t("scanner.stop") : t("scanner.start")}
      </Button>
    </Box>
  );
};

export default BarcodeScanner;
