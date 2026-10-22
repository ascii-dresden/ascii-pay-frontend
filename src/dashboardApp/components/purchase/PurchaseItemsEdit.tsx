import { ProductDto, SavePurchaseItemDto } from "../../../common/contracts";
import { useTranslation } from "react-i18next";
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  AddCircleOutline,
  Close,
  EuroSymbol,
  RemoveCircleOutline,
  SortOutlined,
  StraightenOutlined,
} from "@mui/icons-material";
import React from "react";
import styled from "@emotion/styled";
import { DatePicker } from "@mui/x-date-pickers";
import { CoinInput } from "../transaction/CoinInput";
import { SelectProductPopup } from "../product/SelectProductPopup";
import { parseBestBefore, serializeBestBefore } from "./purchaseUtils";
import { NO_MODAL_PICKER_QUERY } from "./shop/CartItemForm";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { SubProductSelect } from "../product/SubProductSelect";

const StyledEditRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.8em;

  &:not(:nth-last-of-type(1)) > div::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -0.45em;
    right: 0;
    border-bottom: solid 1px black;
    opacity: 0.1;
  }

  & > div {
    margin-left: 0.5em;
    position: relative;
    flex: 1 1 0;
    min-width: 0;
  }
`;

const StyledNameRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 0.7rem;

  & > *:first-of-type {
    flex: 1 1 12rem;
  }
`;

const StyledContainerRow = styled.div`
  display: flex;
  flex: 1 1 0;
  gap: 0.5em;
`;

export const PurchaseItemsEdit = (props: {
  items: SavePurchaseItemDto[];
  setItems: (items: SavePurchaseItemDto[]) => void;
}) => {
  const { t } = useTranslation();

  const updateItem = (i: number, p: SavePurchaseItemDto) => {
    let newPrices = props.items.slice();
    newPrices[i] = p;
    props.setItems(newPrices);
  };
  const removeItem = (i: number) => {
    let newPrices = props.items.slice();
    newPrices.splice(i, 1);
    props.setItems(newPrices);
  };
  const addItem = () => {
    let newPrices = props.items.slice();
    newPrices.push({
      name: "",
      container_size: 0,
      container_count: 0,
      container_cents: 0,
      best_before: null,
      barcode: null,
      collected: true,
      product_id: null,
      sub_product_id: null,
    });
    props.setItems(newPrices);
  };

  return (
    <>
      {props.items.map((p, i) => (
        <StyledEditRow key={i}>
          <IconButton onClick={() => removeItem(i)} color="error">
            <RemoveCircleOutline />
          </IconButton>
          <PurchaseItemRowEdit item={p} setItem={(sp) => updateItem(i, sp)} />
        </StyledEditRow>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddCircleOutline />}
        onClick={() => addItem()}
        sx={{ mt: 2 }}
        fullWidth
      >
        {t("purchase.action.addItem")}
      </Button>
    </>
  );
};

interface CustomProps {
  value: number;
  onChange: (value: number) => void;
}

const ContainerNumberInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    const absOnChange = (value: number) => onChange(value < 0 ? 0 : value);
    return (
      <CoinInput ref={ref} value={value} onChange={absOnChange} {...other} />
    );
  }
);

const CentInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    return (
      <CoinInput
        ref={ref}
        value={value}
        onChange={onChange}
        decimalPlaces={2}
        increment={10}
        {...other}
      />
    );
  }
);

const PurchaseItemRowEdit = (props: {
  item: SavePurchaseItemDto;
  setItem: (item: SavePurchaseItemDto) => void;
}) => {
  const { t } = useTranslation();
  const { data: products } = useGetAllProductsQuery();
  const product =
    props.item.product_id == null
      ? null
      : products?.find((p) => p.id === props.item.product_id) ?? null;

  const setName = (name: string) => {
    props.setItem({
      ...props.item,
      name: name,
    });
  };
  const setContainerSize = (value: number) => {
    props.setItem({
      ...props.item,
      container_size: value,
    });
  };
  const setContainerCount = (value: number) => {
    props.setItem({
      ...props.item,
      container_count: value,
    });
  };
  const setContainerCents = (value: number) => {
    props.setItem({
      ...props.item,
      container_cents: value,
    });
  };
  const setBestBefore = (value: Date | null) => {
    props.setItem({
      ...props.item,
      best_before: serializeBestBefore(value),
    });
  };
  const handleSelectProduct = (product: ProductDto) => {
    props.setItem({
      ...props.item,
      name: product.name,
      product_id: product.id,
      sub_product_id: null,
    });
  };
  const removeProduct = () => {
    props.setItem({
      ...props.item,
      name: "",
      product_id: null,
      sub_product_id: null,
    });
  };

  return (
    <div>
      <StyledNameRow>
        <TextField
          label={t("purchase.item.name")}
          fullWidth
          size="small"
          value={props.item.name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div style={{ marginRight: "-0.6em" }}>
                  {props.item.product_id === null ? (
                    <SelectProductPopup selectProduct={handleSelectProduct} />
                  ) : (
                    <IconButton sx={{ height: "40px" }} onClick={removeProduct}>
                      <Close />
                    </IconButton>
                  )}
                </div>
              </InputAdornment>
            ),
          }}
        />
        <DatePicker
          label={t("purchase.item.best_before")}
          value={parseBestBefore(props.item.best_before)}
          onChange={(v) => setBestBefore(v)}
          desktopModeMediaQuery={NO_MODAL_PICKER_QUERY}
          slotProps={{
            textField: {
              size: "small",
              sx: { flex: "1 1 10rem", minWidth: "10rem" },
            },
            actionBar: { actions: ["clear", "today", "accept"] },
          }}
        />
      </StyledNameRow>
      <SubProductSelect
        product={product}
        value={props.item.sub_product_id ?? null}
        onChange={(subProductId) =>
          props.setItem({ ...props.item, sub_product_id: subProductId })
        }
        size="small"
        sx={{ mb: "0.7rem" }}
      />
      <StyledContainerRow>
        <TextField
          value={props.item.container_count ?? 0}
          onChange={setContainerCount as any}
          size="small"
          label={t("purchase.item.container_count")}
          InputProps={{
            inputComponent: ContainerNumberInputRef as any,
            endAdornment: (
              <InputAdornment position="end">
                <SortOutlined />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          value={props.item.container_cents ?? 0}
          onChange={setContainerCents as any}
          size="small"
          label={t("purchase.item.container_cents")}
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
          value={props.item.container_size ?? 0}
          onChange={setContainerSize as any}
          size="small"
          label={t("purchase.item.container_size")}
          InputProps={{
            inputComponent: ContainerNumberInputRef as any,
            endAdornment: (
              <InputAdornment position="end">
                <StraightenOutlined />
              </InputAdornment>
            ),
          }}
        />
      </StyledContainerRow>
    </div>
  );
};
