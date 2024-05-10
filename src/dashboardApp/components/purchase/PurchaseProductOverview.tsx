import {
  ProductDto,
  PurchaseDto,
  PurchaseItemDto,
} from "../../../common/contracts";
import React, { useEffect } from "react";
import { useGetAllPurchasesQuery } from "../../redux/api/purchaseApi";
import { toast } from "react-toastify";
import { PaperScreenLoader } from "../PaperScreenLoader";
import { useTranslation } from "react-i18next";
import {
  moneyToString,
  percentToString,
} from "../../../terminalApp/components/Money";
import { Grid, InputAdornment, TextField, useTheme } from "@mui/material";
import { EuroSymbol, PercentOutlined } from "@mui/icons-material";
import { CoinInput } from "../transaction/CoinInput";
import styled from "@emotion/styled";
import { amber, green, lightGreen, orange, red } from "@mui/material/colors";

type PurchaseWithProduct = {
  purchase: PurchaseDto;
  item: PurchaseItemDto;
};

export function filterPurchasesByProduct(
  purchases: PurchaseDto[],
  productId: number
): PurchaseWithProduct[] {
  const filtered: PurchaseWithProduct[] = [];

  for (let p of purchases) {
    let item = p.items.find((i) => i.product?.id === productId);

    if (item) {
      filtered.push({
        purchase: p,
        item,
      });
    }
  }

  return filtered;
}

interface CustomProps {
  value: number;
  onChange: (value: number) => void;
}

const PurchaseCentInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    return (
      <CoinInput
        ref={ref}
        value={value}
        onChange={onChange}
        decimalPlaces={2}
        increment={1}
        {...other}
      />
    );
  }
);

const CurrentCentInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
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

const PercentInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
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

type PriceOverviewResult = {
  tax: number;
  purchasePrice: number;
  purchasePriceTax: number;
  purchasePriceWithTax: number;
  currentPrice: number;
  currentPriceWithoutTax: number;
  currentProfit: number;
  currentProfitPercent: number;
  suggestedPrice: number;
  suggestedPriceWithoutTax: number;
  suggestedProfit: number;
  suggestedProfitPercent: number;
};

export function calculateProductPriceOverview(
  currentPrice: number,
  purchasePrice: number,
  targetProfitPercent?: number
): PriceOverviewResult {
  const tax = 1.19;
  const targetProfit = 1 + (targetProfitPercent ?? 0.15);

  const purchasePriceWithTax = purchasePrice * tax;
  const purchasePriceTax = purchasePriceWithTax - purchasePrice;

  const currentPriceWithoutTax = currentPrice / tax;
  const currentProfit = currentPriceWithoutTax - purchasePrice;
  const currentProfitPercent = currentProfit / purchasePrice;

  const suggestedPrice =
    Math.round((purchasePrice * targetProfit * tax) / 10) * 10;
  const suggestedPriceWithoutTax = suggestedPrice / tax;
  const suggestedProfit = suggestedPriceWithoutTax - purchasePrice;
  const suggestedProfitPercent = suggestedProfit / purchasePrice;

  return {
    tax: tax - 1,
    purchasePrice,
    purchasePriceTax,
    purchasePriceWithTax,
    currentPrice,
    currentPriceWithoutTax,
    currentProfit,
    currentProfitPercent,
    suggestedPrice,
    suggestedPriceWithoutTax,
    suggestedProfit,
    suggestedProfitPercent,
  };
}

export const PurchaseItemOverview = (props: { product: ProductDto }) => {
  const { t } = useTranslation();

  const [inputCurrentPrice, setInputCurrentPrice] = React.useState(0);
  const [inputPurchasePrice, setInputPurchasePrice] = React.useState(0);
  const [inputTargetProfitPercent, setInputTargetProfitPercent] =
    React.useState(15);

  const {
    isLoading,
    isError,
    error,
    data: purchases,
  } = useGetAllPurchasesQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load purchases!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (purchases === undefined) {
      return;
    }

    let sortedPurchases = [...purchases];
    sortedPurchases.reverse();
    const filtered = filterPurchasesByProduct(
      sortedPurchases,
      props.product.id
    );

    if (filtered.length === 0) {
      return;
    }

    const latestPurchase = filtered.length > 0 ? filtered[0].item : null;

    if (latestPurchase) {
      const latestPricePerItem = Math.round(
        latestPurchase.container_cents / latestPurchase.container_size
      );
      setInputPurchasePrice(latestPricePerItem);
    }
  }, [purchases, setInputPurchasePrice]);

  useEffect(() => {
    setInputCurrentPrice(props.product.price.Cent ?? 0);
  }, [props.product, setInputCurrentPrice]);

  if (isLoading || purchases === undefined) {
    return <PaperScreenLoader />;
  }

  const result = calculateProductPriceOverview(
    inputCurrentPrice,
    inputPurchasePrice,
    inputTargetProfitPercent / 100
  );

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          value={inputPurchasePrice}
          onChange={setInputPurchasePrice as any}
          size="small"
          label={t("purchase.productOverview.purchasePrice")}
          InputProps={{
            inputComponent: PurchaseCentInputRef as any,
            endAdornment: (
              <InputAdornment position="end">
                <EuroSymbol />
              </InputAdornment>
            ),
          }}
        />
        <StyledTable>
          <tr>
            <td>{t("purchase.productOverview.purchasePrice")}</td>
            <td>{moneyToString(result.purchasePrice)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.purchasePriceTax")}</td>
            <td>
              <small>{percentToString(result.tax)}</small>
              {moneyToString(result.purchasePriceTax)}
            </td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.purchasePriceWithTax")}</td>
            <td>{moneyToString(result.purchasePriceWithTax)}</td>
          </tr>
        </StyledTable>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          value={inputCurrentPrice}
          onChange={setInputCurrentPrice as any}
          size="small"
          label={t("purchase.productOverview.currentPrice")}
          InputProps={{
            inputComponent: CurrentCentInputRef as any,
            endAdornment: (
              <InputAdornment position="end">
                <EuroSymbol />
              </InputAdornment>
            ),
          }}
        />
        <StyledTable>
          <tr>
            <td>{t("purchase.productOverview.currentPrice")}</td>
            <td>{moneyToString(result.currentPrice)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.currentPriceWithoutTax")}</td>
            <td>{moneyToString(result.currentPriceWithoutTax)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.purchasePrice")}</td>
            <td>{moneyToString(result.purchasePrice)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.currentProfit")}</td>
            <td>
              <PurchaseProductPriceHighlight
                profitPercent={result.currentProfitPercent}
              >
                <small>{percentToString(result.currentProfitPercent)}</small>
                {moneyToString(result.currentProfit)}
              </PurchaseProductPriceHighlight>
            </td>
          </tr>
        </StyledTable>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          value={inputTargetProfitPercent}
          onChange={setInputTargetProfitPercent as any}
          size="small"
          label={t("purchase.productOverview.targetProfit")}
          InputProps={{
            inputComponent: PercentInputRef as any,
            endAdornment: (
              <InputAdornment position="end">
                <PercentOutlined />
              </InputAdornment>
            ),
          }}
        />
        <StyledTable>
          <tr>
            <td>{t("purchase.productOverview.suggestedPrice")}</td>
            <td>{moneyToString(result.suggestedPrice)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.suggestedPriceWithoutTax")}</td>
            <td>{moneyToString(result.suggestedPriceWithoutTax)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.purchasePrice")}</td>
            <td>{moneyToString(result.purchasePrice)}</td>
          </tr>
          <tr>
            <td>{t("purchase.productOverview.suggestedProfit")}</td>
            <td>
              <PurchaseProductPriceHighlight
                profitPercent={result.suggestedProfitPercent}
              >
                <small>{percentToString(result.suggestedProfitPercent)}</small>
                {moneyToString(result.suggestedProfit)}
              </PurchaseProductPriceHighlight>
            </td>
          </tr>
        </StyledTable>
      </Grid>
    </Grid>
  );
};

const StyledTable = styled.table`
  padding-top: 0.4em;
  width: 100%;

  & td:last-of-type {
    text-align: right;
    font-family: monospace;
  }

  small {
    padding-right: 0.4em;
  }

  small::before {
    content: "(";
  }

  small::after {
    content: ")";
  }
`;

export const PurchaseProductPriceHighlight = (props: {
  profitPercent: number;
  children: React.ReactNode | React.ReactNode[];
}) => {
  const theme = useTheme();

  let color: string;
  let fontWeight = "inherit";
  if (theme.palette.mode === "light") {
    if (props.profitPercent >= 0.15) {
      color = green[800];
    } else if (props.profitPercent >= 0.1) {
      color = lightGreen[600];
    } else if (props.profitPercent >= 0.5) {
      color = amber[700];
    } else if (props.profitPercent >= 0.0) {
      color = orange[800];
    } else {
      color = red[700];
      fontWeight = "bold";
    }
  } else {
    if (props.profitPercent >= 0.15) {
      color = green[500];
    } else if (props.profitPercent >= 0.1) {
      color = lightGreen[400];
    } else if (props.profitPercent >= 0.5) {
      color = amber[400];
    } else if (props.profitPercent >= 0.0) {
      color = orange[400];
    } else {
      color = red[400];
      fontWeight = "bold";
    }
  }

  return <div style={{ color, fontWeight }}>{props.children}</div>;
};
