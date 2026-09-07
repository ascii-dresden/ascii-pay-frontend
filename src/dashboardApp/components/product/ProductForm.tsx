import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { PercentOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  CoinAmountDto,
  ProductDto,
  SaveProductDto,
  SaveProductStatusPriceDto,
} from "../../../common/contracts";
import { CoinAmountEdit } from "../transaction/CoinAmountEdit";
import { CoinInput } from "../transaction/CoinInput";
import { BarcodeTextField } from "../scanner/BarcodeTextField";
import { CategoryInput } from "./CategoryInput";
import { TagsInput } from "./TagsInput";
import { PrintListsInput } from "./PrintListsInput";
import { ProductInventoryFields } from "./ProductInventoryFields";
import { ProductStatusPricesEdit } from "./ProductStatusPricesEdit";
import { QuickAccessGridNamePicker } from "./QuickAccessGridNamePicker";
import { QuickAccessGridNameIcon } from "./QuickAccessGridNameIcon";
import { useProductMetadataHook } from "./useProductMetadataHook";

export type ProductFormValue = {
  name: string;
  nickname: string;
  category: string;
  barcode: string;
  purchaseTax: number;
  printLists: string[];
  tags: string[];
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  statusPrices: SaveProductStatusPriceDto[];
  stocked: boolean;
  targetQuantity: number;
};

export const emptyProductFormValue = (): ProductFormValue => ({
  name: "",
  nickname: "",
  category: "",
  barcode: "",
  purchaseTax: 19,
  printLists: [],
  tags: [],
  price: {},
  bonus: {},
  statusPrices: [],
  stocked: false,
  targetQuantity: 0,
});

export const productFormValueFromDto = (
  product: ProductDto
): ProductFormValue => ({
  name: product.name,
  nickname: product.nickname ?? "",
  category: product.category,
  barcode: product.barcode ?? "",
  purchaseTax: product.purchase_tax,
  printLists: product.print_lists,
  tags: product.tags,
  price: product.price,
  bonus: product.bonus,
  statusPrices: product.status_prices.map((p) => ({
    status_id: p.status.id,
    price: p.price,
    bonus: p.bonus,
  })),
  stocked: product.stocked,
  targetQuantity: product.target_quantity,
});

export const productFormValueToSaveDto = (
  value: ProductFormValue
): SaveProductDto => {
  const saveProduct: SaveProductDto = {
    name: value.name,
    price: value.price,
    bonus: value.bonus,
    category: value.category,
    purchase_tax: value.purchaseTax,
    tags: value.tags,
    print_lists: value.printLists,
    status_prices: value.statusPrices,
    stocked: value.stocked,
    target_quantity: value.stocked ? value.targetQuantity : 0,
  };
  if (value.nickname.length > 0) {
    saveProduct.nickname = value.nickname;
  }
  if (value.barcode.length > 0) {
    saveProduct.barcode = value.barcode;
  }
  return saveProduct;
};

interface PercentInputProps {
  value: number;
  onChange: (value: number) => void;
}

const PercentInputRef = React.forwardRef<HTMLInputElement, PercentInputProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    return (
      <CoinInput
        ref={ref}
        value={value}
        onChange={onChange}
        increment={1}
        {...other}
      />
    );
  }
);

/** Props shared by the three form sections. */
export type ProductFormSectionProps = {
  value: ProductFormValue;
  onChange: (patch: Partial<ProductFormValue>) => void;
  disabled?: boolean;
  /** Focus the first field on mount (default: true). */
  autoFocus?: boolean;
  /** Error text shown below the name field (basics section only). */
  nameError?: string;
};

/**
 * Section 1: name (with the QuickAccess grid picker), nickname, category and
 * barcode.
 */
export const ProductBasicsFields = (props: ProductFormSectionProps) => {
  const { t } = useTranslation();
  const { value, onChange } = props;
  const { categories: availableCategories } = useProductMetadataHook();

  const [gridPickerAnchorEl, setGridPickerAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const nameInputProps =
    value.category !== "QuickAccess"
      ? {}
      : {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={(e) => setGridPickerAnchorEl(e.currentTarget)}
              >
                <QuickAccessGridNameIcon name={value.name} />
              </IconButton>
            </InputAdornment>
          ),
        };

  return (
    <>
      <TextField
        label={t("product.name")}
        fullWidth
        sx={{ mb: "1rem" }}
        value={value.name}
        onChange={(e) => onChange({ name: e.target.value })}
        InputProps={nameInputProps}
        disabled={props.disabled}
        autoFocus={props.autoFocus ?? true}
        required
        error={props.nameError !== undefined}
        helperText={props.nameError}
      />
      <Popover
        open={gridPickerAnchorEl !== null}
        anchorEl={gridPickerAnchorEl}
        onClose={() => setGridPickerAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <QuickAccessGridNamePicker
          name={value.name}
          onChange={(n) => {
            onChange({ name: n });
            setGridPickerAnchorEl(null);
          }}
        />
      </Popover>
      <TextField
        label={t("product.nickname")}
        fullWidth
        sx={{ mb: "1rem" }}
        value={value.nickname}
        onChange={(e) => onChange({ nickname: e.target.value })}
        disabled={props.disabled}
      />
      <CategoryInput
        value={value.category}
        setValue={(category) => onChange({ category })}
        possibleValues={availableCategories}
        disabled={props.disabled}
      />
      <BarcodeTextField
        label={t("product.barcode")}
        fullWidth
        sx={{ mb: "1rem" }}
        value={value.barcode}
        onChange={(barcode) => onChange({ barcode })}
        disabled={props.disabled}
      />
    </>
  );
};

/**
 * Section 2: tags, print lists and the inventory (assortment) settings.
 */
export const ProductListsFields = (props: ProductFormSectionProps) => {
  const { t } = useTranslation();
  const { value, onChange } = props;
  const { tags: availableTags, printLists: availablePrintLists } =
    useProductMetadataHook();

  return (
    <>
      <TagsInput
        values={value.tags}
        setValues={(tags) => onChange({ tags })}
        possibleValues={availableTags}
      />
      <PrintListsInput
        values={value.printLists}
        setValues={(printLists) => onChange({ printLists })}
        possibleValues={availablePrintLists}
      />
      <Typography
        variant="overline"
        component="h2"
        color="text.secondary"
        sx={{ display: "block", lineHeight: 1.5, mb: 0.5 }}
      >
        {t("product.edit.inventorySection")}
      </Typography>
      <ProductInventoryFields
        stocked={value.stocked}
        setStocked={(stocked) => onChange({ stocked })}
        targetQuantity={value.targetQuantity}
        setTargetQuantity={(targetQuantity) => onChange({ targetQuantity })}
      />
    </>
  );
};

/**
 * Section 3: purchase tax, price, bonus and status prices.
 */
export const ProductPricingFields = (props: ProductFormSectionProps) => {
  const { t } = useTranslation();
  const { value, onChange } = props;

  const toggleTax = () => {
    onChange({ purchaseTax: value.purchaseTax === 19 ? 7 : 19 });
  };

  return (
    <>
      <TextField
        fullWidth
        sx={{ mb: "1rem" }}
        value={value.purchaseTax}
        onChange={((purchaseTax: number) => onChange({ purchaseTax })) as any}
        label={t("product.purchaseTax")}
        disabled={props.disabled}
        InputProps={{
          inputComponent: PercentInputRef as any,
          endAdornment: (
            <InputAdornment position="end" onClick={toggleTax}>
              <PercentOutlined />
            </InputAdornment>
          ),
        }}
      />
      <CoinAmountEdit
        label={t("product.price")}
        coins={value.price}
        onChange={(price) => onChange({ price })}
      />
      <CoinAmountEdit
        label={t("product.bonus")}
        coins={value.bonus}
        onChange={(bonus) => onChange({ bonus })}
      />
      <ProductStatusPricesEdit
        statusPrices={value.statusPrices}
        setStatusPrices={(statusPrices) => onChange({ statusPrices })}
      />
    </>
  );
};

/**
 * The complete product form (all three sections) used by the edit page. The
 * parent owns the state and receives partial updates via `onChange`.
 */
export const ProductForm = (props: {
  value: ProductFormValue;
  onChange: (patch: Partial<ProductFormValue>) => void;
  disabled?: boolean;
}) => {
  return (
    <Box pt={1}>
      <ProductBasicsFields {...props} />
      <ProductListsFields {...props} />
      <ProductPricingFields {...props} />
    </Box>
  );
};
