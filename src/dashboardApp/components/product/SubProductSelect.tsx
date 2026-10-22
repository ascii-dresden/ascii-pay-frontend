import React from "react";
import { MenuItem, SxProps, TextField, Theme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ProductDto } from "../../../common/contracts";
import { selectableSubProducts } from "./subProductUtils";

/**
 * Picks one of the sub products of `product` (or none). Renders nothing for
 * products without sub products, so it can be dropped into any item form.
 */
export const SubProductSelect = (props: {
  product: ProductDto | null | undefined;
  value: number | null;
  onChange: (subProductId: number | null) => void;
  /** Text of the "no sub product" option; defaults to "<product> (any)". */
  noneLabel?: string;
  label?: string;
  size?: "small" | "medium";
  disabled?: boolean;
  sx?: SxProps<Theme>;
}) => {
  const { t } = useTranslation();
  const options = selectableSubProducts(props.product, props.value);
  if (!props.product || options.length === 0) {
    return null;
  }

  return (
    <TextField
      select
      fullWidth
      size={props.size}
      label={props.label ?? t("product.subProduct")}
      disabled={props.disabled}
      value={props.value ?? ""}
      SelectProps={{ displayEmpty: true }}
      InputLabelProps={{ shrink: true }}
      onChange={(e) => {
        const raw = e.target.value as unknown as number | "";
        props.onChange(raw === "" ? null : Number(raw));
      }}
      sx={props.sx}
    >
      <MenuItem value="">
        <em>
          {props.noneLabel ??
            t("product.subProductAny", { name: props.product.name })}
        </em>
      </MenuItem>
      {options.map((sub) => (
        <MenuItem key={sub.id} value={sub.id}>
          {sub.name}
          {sub.active ? "" : ` (${t("product.subProductInactive")})`}
        </MenuItem>
      ))}
    </TextField>
  );
};
