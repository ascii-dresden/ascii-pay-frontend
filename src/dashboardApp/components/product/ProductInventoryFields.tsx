import { Box, FormControlLabel, Switch, TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const ProductInventoryFields = (props: {
  stocked: boolean;
  setStocked: (stocked: boolean) => void;
  targetQuantity: number;
  setTargetQuantity: (targetQuantity: number) => void;
  /**
   * Sum of the sub product targets. When set, the product is only a heading in
   * the inventory and its own target is not edited here.
   */
  subProductTargetSum?: number | null;
}) => {
  const { t } = useTranslation();
  const [text, setText] = React.useState(props.targetQuantity.toString());

  React.useEffect(() => {
    setText(props.targetQuantity.toString());
  }, [props.targetQuantity]);

  const commit = () => {
    const parsed = parseInt(text, 10);
    const value = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    setText(value.toString());
    if (value !== props.targetQuantity) {
      props.setTargetQuantity(value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: "1rem",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={props.stocked}
            onChange={(e) => props.setStocked(e.target.checked)}
          />
        }
        label={t("product.stocked")}
      />
      <TextField
        label={t("product.targetQuantity")}
        type="number"
        size="small"
        sx={{ width: 140, flexShrink: 0 }}
        inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
        disabled={!props.stocked || props.subProductTargetSum != null}
        value={
          props.subProductTargetSum != null
            ? props.subProductTargetSum.toString()
            : text
        }
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
          }
        }}
        helperText={
          props.subProductTargetSum != null
            ? t("product.targetQuantitySubProductsHint")
            : t("product.targetQuantityHint")
        }
      />
    </Box>
  );
};
