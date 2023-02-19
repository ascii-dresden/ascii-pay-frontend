import { Chip } from "@mui/material";
import { GrassOutlined } from "@mui/icons-material";
import * as React from "react";

export const TagChip = (props: { tag: string }) => {
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" = "default";
  let icon: React.ReactElement | undefined;

  if (props.tag === "vegan") {
    color = "success";
    icon = <GrassOutlined />;
  }
  if (props.tag === "bio") {
    color = "primary";
  }

  return (
    <Chip
      sx={{ mr: 1 }}
      size="small"
      label={props.tag}
      variant="outlined"
      icon={icon}
      color={color}
    />
  );
};
