import React from "react";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutline,
  PercentOutlined,
  PrintOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ProductDto, SaveSubProductDto } from "../../../common/contracts";

/**
 * One row of the editor. `key` identifies the row inside the form: barcodes
 * point at it, and the save request uses it to link codes to sub products
 * that are created by the same save.
 */
export type SubProductFormValue = {
  key: string;
  /** Only set for sub products that are already stored. */
  id?: number;
  name: string;
  purchaseTax: number;
  active: boolean;
  /** Listed below the product on its print lists. */
  showOnPrintList: boolean;
  /** Target stock in single units (inventory is counted per sub product). */
  targetQuantity: number;
};

export const subProductKeyForId = (id: number) => `id-${id}`;

let newKeyCounter = 0;
const nextNewKey = () => `new-${++newKeyCounter}`;

export const subProductsFromDto = (
  product: ProductDto
): SubProductFormValue[] =>
  (product.sub_products ?? []).map((sub) => ({
    key: subProductKeyForId(sub.id),
    id: sub.id,
    name: sub.name,
    purchaseTax: sub.purchase_tax,
    active: sub.active,
    showOnPrintList: sub.show_on_print_list,
    targetQuantity: sub.target_quantity,
  }));

export const subProductsToSaveDto = (
  subProducts: SubProductFormValue[]
): SaveSubProductDto[] =>
  subProducts
    // A new row that never got a name is just an unused "add" click.
    .filter((sub) => sub.id !== undefined || sub.name.trim().length > 0)
    .map((sub) => ({
      id: sub.id ?? null,
      key: sub.key,
      name: sub.name.trim(),
      purchase_tax: sub.purchaseTax,
      active: sub.active,
      show_on_print_list: sub.showOnPrintList,
      target_quantity: Math.max(0, sub.targetQuantity),
    }));

/**
 * Editor for the sub products of a product: the varieties that are bought
 * (and priced) separately but sold as the product. Each one has its own name
 * and purchase tax; the codes are assigned to them in the barcode editor.
 */
export const ProductSubProductsInput = (props: {
  values: SubProductFormValue[];
  onChange: (values: SubProductFormValue[]) => void;
  /** Purchase tax of the product, used for new rows. */
  defaultPurchaseTax: number;
  /** Show the target field (only for products in the assortment). */
  showTargets?: boolean;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  const { values, onChange } = props;

  const update = (index: number, patch: Partial<SubProductFormValue>) =>
    onChange(
      values.map((value, i) => (i === index ? { ...value, ...patch } : value))
    );

  const remove = (index: number) =>
    onChange(values.filter((_, i) => i !== index));

  const add = () =>
    onChange([
      ...values,
      {
        key: nextNewKey(),
        name: "",
        purchaseTax: props.defaultPurchaseTax,
        active: true,
        showOnPrintList: false,
        targetQuantity: 0,
      },
    ]);

  return (
    <Box sx={{ mb: "1rem" }}>
      <Typography variant="subtitle2">{t("product.subProducts")}</Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        {t("product.subProductsHint")}
      </Typography>
      {values.length === 0 ? null : <Box sx={{ height: 8 }} />}
      {values.map((value, index) => (
        <Box
          key={value.key}
          sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1.5 }}
        >
          <TextField
            label={t("product.subProductName")}
            size="small"
            disabled={props.disabled}
            value={value.name}
            autoFocus={value.id === undefined && value.name === ""}
            onChange={(e) => update(index, { name: e.target.value })}
            error={value.id !== undefined && value.name.trim().length === 0}
            sx={{ flex: 3 }}
          />
          {props.showTargets ? (
            <TextField
              label={t("product.subProductTarget")}
              size="small"
              type="number"
              disabled={props.disabled}
              inputProps={{ min: 0, inputMode: "numeric" }}
              value={value.targetQuantity}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                update(index, {
                  targetQuantity: Number.isNaN(parsed)
                    ? 0
                    : Math.max(0, parsed),
                });
              }}
              onFocus={(e) => e.target.select()}
              sx={{ flex: 1, minWidth: "4.5rem" }}
            />
          ) : null}
          <TextField
            label={t("product.purchaseTax")}
            size="small"
            type="number"
            disabled={props.disabled}
            inputProps={{ min: 0, inputMode: "numeric" }}
            value={value.purchaseTax}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              update(index, {
                purchaseTax: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
              });
            }}
            onFocus={(e) => e.target.select()}
            sx={{ flex: 1, minWidth: "5.5rem" }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    update(index, {
                      purchaseTax: value.purchaseTax === 19 ? 7 : 19,
                    })
                  }
                >
                  <PercentOutlined fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title={t("product.subProductShowOnPrintList")}>
            <span>
              <IconButton
                onClick={() =>
                  update(index, { showOnPrintList: !value.showOnPrintList })
                }
                disabled={props.disabled}
                color={value.showOnPrintList ? "primary" : "default"}
                aria-pressed={value.showOnPrintList}
                aria-label={t("product.subProductShowOnPrintList") ?? "print"}
              >
                <PrintOutlined
                  sx={{ opacity: value.showOnPrintList ? 1 : 0.4 }}
                />
              </IconButton>
            </span>
          </Tooltip>
          {value.id !== undefined ? (
            <Tooltip title={t("product.subProductActiveHint")}>
              <FormControlLabel
                sx={{ mx: 0, mt: 0.5 }}
                control={
                  <Switch
                    size="small"
                    checked={value.active}
                    disabled={props.disabled}
                    onChange={(e) =>
                      update(index, { active: e.target.checked })
                    }
                  />
                }
                label={
                  <Typography variant="caption">
                    {t("product.subProductActive")}
                  </Typography>
                }
              />
            </Tooltip>
          ) : null}
          <Tooltip title={t("product.subProductRemove")}>
            <span>
              <IconButton
                onClick={() => remove(index)}
                disabled={props.disabled}
                aria-label={t("product.subProductRemove") ?? "remove"}
              >
                <DeleteOutline />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ))}
      <Button
        size="small"
        startIcon={<AddOutlined />}
        onClick={add}
        disabled={props.disabled}
      >
        {t("product.subProductAdd")}
      </Button>
    </Box>
  );
};
