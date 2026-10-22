import React from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutline,
  StraightenOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ProductDto, SaveProductBarcodeDto } from "../../../common/contracts";
import { BarcodeTextField } from "../scanner/BarcodeTextField";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import {
  SubProductFormValue,
  subProductKeyForId,
} from "./ProductSubProductsInput";

/** One row of the editor. `id` is only set for codes that are already stored. */
export type ProductBarcodeFormValue = {
  id?: number;
  code: string;
  containerSize: number;
  label: string;
  /** `key` of the sub product the code belongs to; null = the product itself. */
  subProductKey: string | null;
};

export const emptyProductBarcode = (
  code: string = ""
): ProductBarcodeFormValue => ({
  code,
  containerSize: 1,
  label: "",
  subProductKey: null,
});

export const productBarcodesFromDto = (
  product: ProductDto
): ProductBarcodeFormValue[] =>
  product.barcodes.map((barcode) => ({
    id: barcode.id,
    code: barcode.code,
    containerSize: barcode.container_size,
    label: barcode.label,
    subProductKey:
      barcode.sub_product_id != null
        ? subProductKeyForId(barcode.sub_product_id)
        : null,
  }));

/**
 * Drops empty rows; the server trims, dedupes and clamps the rest. Links to
 * sub products go by form key, so they also work for sub products that the
 * same save creates; a key whose sub product was removed falls back to the
 * product itself.
 */
export const productBarcodesToSaveDto = (
  barcodes: ProductBarcodeFormValue[],
  subProducts: SubProductFormValue[]
): SaveProductBarcodeDto[] =>
  barcodes
    .filter((barcode) => barcode.code.trim().length > 0)
    .map((barcode) => ({
      code: barcode.code.trim(),
      container_size: Math.max(1, barcode.containerSize),
      label: barcode.label.trim(),
      sub_product_key: subProducts.some(
        (sub) => sub.key === barcode.subProductKey
      )
        ? barcode.subProductKey
        : null,
    }));

/**
 * Warns when another product already uses this code. Barcodes are deliberately
 * not unique in the database (a scan then resolves to the older product), so
 * this is a hint and not a validation error.
 */
const DuplicateHint = (props: { code: string; productId?: number }) => {
  const { t } = useTranslation();
  const code = props.code.trim();
  // The cached product list is enough here and costs no extra request per
  // keystroke; the dedicated conflicts endpoint exists for clients without it.
  const { data: products } = useGetAllProductsQuery();

  if (code.length === 0) {
    return null;
  }
  const others = (products ?? []).filter(
    (product) =>
      product.id !== props.productId &&
      product.barcodes.some((barcode) => barcode.code === code)
  );
  if (others.length === 0) {
    return null;
  }
  return (
    <Typography variant="caption" color="warning.main">
      {t("product.barcodeDuplicate", {
        names: others.map((product) => product.name).join(", "),
      })}
    </Typography>
  );
};

/**
 * Editor for the barcodes of a product. Every code is a purchasing variant with
 * its own container size: the single bottle (size 1) and the crate (size 20)
 * carry different codes but are the same article. Codes that are pure aliases
 * just keep size 1.
 */
export const ProductBarcodesInput = (props: {
  values: ProductBarcodeFormValue[];
  onChange: (values: ProductBarcodeFormValue[]) => void;
  /** Sub products of the form; when present every code can be assigned to one. */
  subProducts?: SubProductFormValue[];
  /** Name of the product, for the "belongs to the product itself" option. */
  productName?: string;
  /** Id of the product being edited, so it is not reported as its own duplicate. */
  productId?: number;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  const { values, onChange } = props;
  const subProducts = props.subProducts ?? [];

  const update = (index: number, patch: Partial<ProductBarcodeFormValue>) =>
    onChange(
      values.map((value, i) => (i === index ? { ...value, ...patch } : value))
    );

  const remove = (index: number) =>
    onChange(values.filter((_, i) => i !== index));

  return (
    <Box sx={{ mb: "1rem" }}>
      <Typography variant="subtitle2">{t("product.barcodes")}</Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        {t("product.barcodesHint")}
      </Typography>
      {values.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
          {t("product.barcodesEmpty")}
        </Typography>
      ) : (
        <Box sx={{ height: 8 }} />
      )}
      {values.map((value, index) => (
        <Box key={index} sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <BarcodeTextField
              label={t("product.barcode")}
              fullWidth
              value={value.code}
              onChange={(code) => update(index, { code })}
              disabled={props.disabled}
            />
            <Tooltip title={t("product.barcodeRemove")}>
              <span>
                <IconButton
                  onClick={() => remove(index)}
                  disabled={props.disabled}
                  aria-label={t("product.barcodeRemove") ?? "remove"}
                  sx={{ mt: 1 }}
                >
                  <DeleteOutline />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
            <TextField
              label={t("product.barcodeContainerSizeShort")}
              type="number"
              size="small"
              disabled={props.disabled}
              inputProps={{ min: 1, inputMode: "numeric" }}
              value={value.containerSize}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                update(index, {
                  containerSize: Number.isNaN(parsed) ? 1 : Math.max(1, parsed),
                });
              }}
              onFocus={(e) => e.target.select()}
              sx={{ flex: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <StraightenOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label={t("product.barcodeLabel")}
              size="small"
              disabled={props.disabled}
              value={value.label}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder={t("product.barcodeLabelPlaceholder") ?? ""}
              sx={{ flex: 2 }}
            />
          </Box>
          {subProducts.length > 0 ? (
            <TextField
              select
              fullWidth
              size="small"
              label={t("product.barcodeSubProduct")}
              disabled={props.disabled}
              value={
                subProducts.some((sub) => sub.key === value.subProductKey)
                  ? value.subProductKey
                  : ""
              }
              onChange={(e) =>
                update(index, { subProductKey: e.target.value || null })
              }
              sx={{ mt: 1 }}
            >
              <MenuItem value="">
                <em>
                  {t("product.barcodeSubProductNone", {
                    name: props.productName || t("product.name"),
                  })}
                </em>
              </MenuItem>
              {subProducts.map((sub) => (
                <MenuItem key={sub.key} value={sub.key}>
                  {sub.name.trim() || t("product.subProductUnnamed")}
                  {sub.active ? "" : ` (${t("product.subProductInactive")})`}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
          <DuplicateHint code={value.code} productId={props.productId} />
        </Box>
      ))}
      <Button
        size="small"
        startIcon={<AddOutlined />}
        onClick={() => onChange([...values, emptyProductBarcode()])}
        disabled={props.disabled}
      >
        {t("product.barcodeAdd")}
      </Button>
    </Box>
  );
};
