import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  EuroSymbol,
  PlaylistAddOutlined,
  Remove,
  StraightenOutlined,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";
import {
  ProductBarcodeDto,
  ProductDto,
  PurchaseItemDto,
  SavePurchaseItemDto,
} from "../../../../common/contracts";
import { BASE_URL } from "../../../../const";
import { stringAvatar } from "../../../../common/stringAvatar";
import { moneyToString } from "../../../../terminalApp/components/Money";
import { CoinInput } from "../../transaction/CoinInput";
import { LastPurchaseInfo } from "../usePurchaseHistory";
import {
  parseBestBefore,
  serializeBestBefore,
  unitPriceCents,
} from "../purchaseUtils";

/** Always render the popper variant of the date picker (no modal dialog). */
export const NO_MODAL_PICKER_QUERY = "@media (min-width: 0px)";

export type CartItemFormState = {
  name: string;
  count: number;
  cents: number;
  size: number;
  bestBefore: Date | null;
};

/**
 * Initial form values for an existing (planned or collected) row, falling
 * back to the last finalized purchase of the product for price and size.
 */
export const cartItemFormFromItem = (
  item: PurchaseItemDto | null | undefined,
  last: LastPurchaseInfo | null,
  fallbackName: string = ""
): CartItemFormState => ({
  name: item?.name ?? fallbackName,
  count: item?.container_count || 1,
  cents: item?.container_cents || last?.container_cents || 0,
  size: item?.container_size || last?.container_size || 1,
  bestBefore: parseBestBefore(item?.best_before),
});

export const cartItemFormToSave = (
  form: CartItemFormState,
  options: {
    productId: number | null;
    barcode: string | null;
    collected: boolean;
    fallbackName?: string;
  }
): SavePurchaseItemDto => ({
  name: form.name.trim() || options.fallbackName || "",
  container_count: form.count,
  container_cents: form.cents,
  container_size: Math.max(1, form.size),
  best_before: serializeBestBefore(form.bestBefore),
  barcode: options.barcode,
  collected: options.collected,
  product_id: options.productId,
});

export const canSubmitCartItemForm = (
  form: CartItemFormState,
  requireName: boolean
): boolean => form.count > 0 && (!requireName || form.name.trim().length > 0);

interface CentInputProps {
  value: number;
  onChange: (value: number) => void;
}

const CentInputRef = React.forwardRef<HTMLInputElement, CentInputProps>(
  function CentInput(props, ref) {
    const { value, onChange, ...other } = props;
    return (
      <CoinInput
        ref={ref}
        value={value}
        onChange={(v) => onChange(v < 0 ? 0 : v)}
        decimalPlaces={2}
        increment={10}
        {...other}
      />
    );
  }
);

export const NumberStepper = (props: {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) => {
  const min = props.min ?? 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <IconButton
        onClick={() => props.onChange(Math.max(min, props.value - 1))}
        disabled={props.disabled || props.value <= min}
        size="large"
        aria-label="decrease"
      >
        <Remove />
      </IconButton>
      <TextField
        label={props.label}
        size="small"
        type="number"
        disabled={props.disabled}
        inputProps={{
          min,
          inputMode: "numeric",
          style: { textAlign: "center" },
        }}
        value={Number.isFinite(props.value) ? props.value : ""}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          props.onChange(Number.isNaN(v) ? min : Math.max(min, v));
        }}
        onFocus={(e) => e.target.select()}
        sx={{ flex: 1 }}
      />
      <IconButton
        onClick={() => props.onChange(props.value + 1)}
        size="large"
        disabled={props.disabled}
        aria-label="increase"
      >
        <Add />
      </IconButton>
    </Box>
  );
};

/**
 * Header (image, name, category) and info chips for a registered product or
 * a free item. Shared by the add and edit pages.
 */
export const CartItemHeader = (props: {
  product: ProductDto | null;
  title: string;
  barcode?: string | null;
  lastPurchase: LastPurchaseInfo | null;
  /** The scanned purchasing variant, when the code belongs to the product. */
  variant?: ProductBarcodeDto | null;
  /** Count of planned containers for the product (shown as "on list"). */
  plannedCount?: number;
}) => {
  const { t } = useTranslation();
  const { product } = props;
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {product ? (
          <Avatar
            alt={product.name}
            src={`${BASE_URL}/product/${product.id}/image`}
            variant="rounded"
            {...stringAvatar(product.name)}
            sx={{ ...stringAvatar(product.name).sx, width: 56, height: 56 }}
          />
        ) : null}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {props.title}
          </Typography>
          {product ? (
            <Typography variant="body2" color="text.secondary" noWrap>
              {product.category}
              {product.nickname ? ` · ${product.nickname}` : ""}
            </Typography>
          ) : null}
          {props.barcode ? (
            <Typography variant="body2" color="text.secondary" noWrap>
              {props.barcode}
            </Typography>
          ) : null}
        </Box>
      </Box>
      {product ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
        >
          {props.variant ? (
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              icon={<StraightenOutlined />}
              label={
                props.variant.label
                  ? `${props.variant.label} · ${t("purchase.shop.variantUnits", {
                      count: props.variant.container_size,
                    })}`
                  : t("purchase.shop.variantUnits", {
                      count: props.variant.container_size,
                    })
              }
            />
          ) : null}
          <Chip
            size="small"
            label={
              props.lastPurchase
                ? t("purchase.shop.lastPurchase", {
                    price: moneyToString(props.lastPurchase.container_cents),
                    size: props.lastPurchase.container_size,
                  }) +
                  (props.lastPurchase.container_size > 1
                    ? ` · ${t("purchase.item.unitPriceShort", {
                        price: moneyToString(
                          unitPriceCents(
                            props.lastPurchase.container_cents,
                            props.lastPurchase.container_size
                          )
                        ),
                      })}`
                    : "")
                : t("purchase.shop.noLastPurchase")
            }
          />
          <Chip
            size="small"
            label={
              product.stocked
                ? t("purchase.shop.target", { count: product.target_quantity })
                : t("purchase.shop.notStocked")
            }
            variant="outlined"
          />
          {props.plannedCount && props.plannedCount > 0 ? (
            <Chip
              size="small"
              color="info"
              icon={<PlaylistAddOutlined />}
              label={t("purchase.shop.onList", { count: props.plannedCount })}
            />
          ) : null}
        </Stack>
      ) : null}
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

/**
 * Controlled form for a cart row: optional name, count stepper, container
 * price, container size, best-before date and the running subtotal.
 */
export const CartItemForm = (props: {
  value: CartItemFormState;
  onChange: (value: CartItemFormState) => void;
  /** Show the free-text name field (items without a linked product). */
  showName: boolean;
  autoFocusName?: boolean;
  disabled?: boolean;
  onSubmit?: () => void;
}) => {
  const { t } = useTranslation();
  const { value, onChange } = props;
  const update = (patch: Partial<CartItemFormState>) =>
    onChange({ ...value, ...patch });

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {props.showName ? (
        <TextField
          label={t("purchase.shop.freeItemName")}
          fullWidth
          autoFocus={props.autoFocusName}
          disabled={props.disabled}
          value={value.name}
          onChange={(e) => update({ name: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              props.onSubmit?.();
            }
          }}
        />
      ) : null}
      <NumberStepper
        label={t("purchase.item.container_count")}
        value={value.count}
        min={0}
        disabled={props.disabled}
        onChange={(count) => update({ count })}
      />
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField
          value={value.cents}
          onChange={((v: number) => update({ cents: v })) as any}
          label={t("purchase.item.container_cents")}
          disabled={props.disabled}
          sx={{ flex: 1 }}
          InputProps={{
            inputComponent: CentInputRef as any,
            endAdornment: (
              <InputAdornment position="end">
                <EuroSymbol />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={t("purchase.item.container_size")}
          type="number"
          disabled={props.disabled}
          inputProps={{ min: 1, inputMode: "numeric" }}
          value={value.size}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            update({ size: Number.isNaN(v) ? 1 : Math.max(1, v) });
          }}
          onFocus={(e) => e.target.select()}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <StraightenOutlined />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <DatePicker
        label={t("purchase.item.best_before")}
        value={value.bestBefore}
        disabled={props.disabled}
        onChange={(v) => update({ bestBefore: v })}
        desktopModeMediaQuery={NO_MODAL_PICKER_QUERY}
        slotProps={{
          textField: { fullWidth: true },
          actionBar: { actions: ["clear", "today", "accept"] },
        }}
      />
      {value.size > 1 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            mt: -1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t("purchase.item.unitPrice")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {moneyToString(unitPriceCents(value.cents, value.size))}
          </Typography>
        </Box>
      ) : null}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("purchase.item.subtotal")}
        </Typography>
        <Typography variant="h6">
          {moneyToString(value.count * value.cents)}
        </Typography>
      </Box>
    </Stack>
  );
};
