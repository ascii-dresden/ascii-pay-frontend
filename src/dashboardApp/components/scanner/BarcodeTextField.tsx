import React from "react";
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import { QrCodeScanner } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const BarcodeScanner = React.lazy(() => import("./BarcodeScanner"));

/**
 * Text field for barcodes with a scan toggle. Instead of opening a dialog the
 * camera scanner expands inline below the field and collapses again after a
 * successful scan.
 */
export const BarcodeTextField = (
  props: Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (value: string) => void;
    /** Called after a code was scanned (in addition to onChange). */
    onScanned?: (code: string) => void;
  }
) => {
  const { value, onChange, onScanned, InputProps, ...rest } = props;
  const { t } = useTranslation();
  const [scanning, setScanning] = React.useState(false);

  const handleDetected = React.useCallback(
    (code: string) => {
      setScanning(false);
      onChange(code);
      onScanned?.(code);
    },
    [onChange, onScanned]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={t("scanner.scanButton")}>
                <IconButton
                  edge="end"
                  color={scanning ? "primary" : "default"}
                  aria-label={t("scanner.scanButton") ?? "scan"}
                  onClick={() => setScanning((s) => !s)}
                  disabled={rest.disabled}
                >
                  <QrCodeScanner />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <Collapse in={scanning} unmountOnExit>
        <Box sx={{ mt: 1, mb: 2 }}>
          <React.Suspense fallback={null}>
            <BarcodeScanner
              onDetected={handleDetected}
              autoStart
              active={scanning}
            />
          </React.Suspense>
        </Box>
      </Collapse>
    </Box>
  );
};
