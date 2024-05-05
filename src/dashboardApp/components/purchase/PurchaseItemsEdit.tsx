import { ProductDto, SavePurchaseItemDto } from "../../../common/contracts";
import { useTranslation } from "react-i18next";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
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
import { CoinInput } from "../transaction/CoinInput";
import { SelectProductPopup } from "../product/SelectProductPopup";

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
      product_id: null,
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

  const setName = (name: string) => {
    props.setItem({
      name: name,
      container_size: props.item.container_size,
      container_count: props.item.container_count,
      container_cents: props.item.container_cents,
      product_id: props.item.product_id,
    });
  };
  const setContainerSize = (value: number) => {
    props.setItem({
      name: props.item.name,
      container_size: value,
      container_count: props.item.container_count,
      container_cents: props.item.container_cents,
      product_id: props.item.product_id,
    });
  };
  const setContainerCount = (value: number) => {
    props.setItem({
      name: props.item.name,
      container_size: props.item.container_size,
      container_count: value,
      container_cents: props.item.container_cents,
      product_id: props.item.product_id,
    });
  };
  const setContainerCents = (value: number) => {
    props.setItem({
      name: props.item.name,
      container_size: props.item.container_size,
      container_count: props.item.container_count,
      container_cents: value,
      product_id: props.item.product_id,
    });
  };
  const handleSelectProduct = (product: ProductDto) => {
    props.setItem({
      name: product.name,
      container_size: props.item.container_size,
      container_count: props.item.container_count,
      container_cents: props.item.container_count,
      product_id: product.id,
    });
  };
  const removeProduct = () => {
    props.setItem({
      name: "",
      container_size: props.item.container_size,
      container_count: props.item.container_count,
      container_cents: props.item.container_count,
      product_id: null,
    });
  };

  return (
    <div>
      <TextField
        label={t("purchase.item.name")}
        fullWidth
        sx={{ mb: "0.7rem" }}
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
