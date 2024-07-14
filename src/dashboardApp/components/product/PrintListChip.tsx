import { Chip } from "@mui/material";
import * as React from "react";

export const PrintListChip = (props: { tag: string }) => {
  return (
    <Chip sx={{ mr: 1 }} size="small" label={props.tag} variant="outlined" />
  );
};
