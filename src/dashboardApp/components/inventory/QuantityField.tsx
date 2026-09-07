import { TextField } from "@mui/material";
import React from "react";

/**
 * Small integer input (min 0) that keeps a local text buffer and commits the
 * parsed value on blur or Enter.
 */
export const QuantityField = (props: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  width?: number;
  label?: string;
  ariaLabel?: string;
}) => {
  const [text, setText] = React.useState(props.value.toString());

  React.useEffect(() => {
    setText(props.value.toString());
  }, [props.value]);

  const commit = () => {
    const parsed = parseInt(text, 10);
    if (isNaN(parsed) || parsed < 0) {
      setText(props.value.toString());
      return;
    }
    if (parsed !== props.value) {
      props.onChange(parsed);
    } else {
      setText(parsed.toString());
    }
  };

  return (
    <TextField
      type="number"
      size="small"
      label={props.label}
      disabled={props.disabled}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
      inputProps={{
        min: 0,
        step: 1,
        inputMode: "numeric",
        "aria-label": props.ariaLabel,
        style: { textAlign: "right" },
      }}
      sx={{ width: props.width ?? 96 }}
    />
  );
};
