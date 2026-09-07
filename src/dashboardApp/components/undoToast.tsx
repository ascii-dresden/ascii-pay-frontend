import React from "react";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";

/**
 * Info toast with an inline "Undo" button. Used instead of confirmation
 * pages for list row removals (owner rule: no dialogs).
 */
export const undoToast = (
  message: string,
  undoLabel: string,
  onUndo: () => void
) => {
  toast.info(
    ({ closeToast }) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <span style={{ flex: 1 }}>{message}</span>
        <Button
          size="small"
          color="inherit"
          onClick={() => {
            closeToast?.();
            onUndo();
          }}
        >
          {undoLabel}
        </Button>
      </Box>
    ),
    { autoClose: 6000 }
  );
};
