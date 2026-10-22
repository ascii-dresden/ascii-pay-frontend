import { ProductDto, SubProductDto } from "../../../common/contracts";
import React, { useEffect } from "react";
import { PaperScreenLoader } from "../PaperScreenLoader";
import { LastPurchaseInfo, usePurchaseHistory } from "./usePurchaseHistory";
import { unitPriceCents } from "./purchaseUtils";
import { useTranslation } from "react-i18next";
import {
  moneyToString,
  percentToString,
} from "../../../terminalApp/components/Money";
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { EuroSymbol, PercentOutlined } from "@mui/icons-material";
import { CoinInput } from "../transaction/CoinInput";
import styled from "@emotion/styled";
import { amber, green, lightGreen, orange, red } from "@mui/material/colors";

const dateFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });

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
  sellingTax: number;
  purchaseTax: number;
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
  targetProfitPercent?: number | undefined,
  productPurchaseTax?: number | undefined
): PriceOverviewResult {
  const sellingTax = 1.19;
  const purchaseTax = (productPurchaseTax ?? 0.19) + 1;
  const targetProfit = 1 + (targetProfitPercent ?? 0.15);

  const purchasePriceWithTax = purchasePrice * purchaseTax;
  const purchasePriceTax = purchasePriceWithTax - purchasePrice;

  const currentPriceWithoutTax = currentPrice / sellingTax;
  const currentProfit = currentPriceWithoutTax - purchasePrice;
  const currentProfitPercent = currentProfit / purchasePrice;

  const suggestedPrice =
    Math.round((purchasePrice * targetProfit * sellingTax) / 10) * 10;
  const suggestedPriceWithoutTax = suggestedPrice / sellingTax;
  const suggestedProfit = suggestedPriceWithoutTax - purchasePrice;
  const suggestedProfitPercent = suggestedProfit / purchasePrice;

  return {
    sellingTax: sellingTax - 1,
    purchaseTax: purchaseTax - 1,
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

/** Which sub product price the margin of a product with sub products is based on. */
export type SubProductPriceBasis = "max" | "average";

type SubProductPrice = {
  sub: SubProductDto;
  last: LastPurchaseInfo;
  /** Unit price without tax, in cents. */
  net: number;
  /** Unit price including the sub product's purchase tax, in cents. */
  gross: number;
};

/**
 * The purchase price (net) and tax to calculate the margin with. With sub
 * products this is either the most expensive one (by price including tax, so
 * no variety is sold at a loss) or the average over all of them; the average
 * tax is chosen so that net * (1 + tax) is the average gross price.
 */
export function subProductPriceBasis(
  prices: SubProductPrice[],
  basis: SubProductPriceBasis
): { net: number; tax: number } | null {
  if (prices.length === 0) {
    return null;
  }
  if (basis === "max") {
    const max = prices.reduce((a, b) => (b.gross > a.gross ? b : a));
    return { net: max.net, tax: max.sub.purchase_tax / 100 };
  }
  const net = prices.reduce((sum, p) => sum + p.net, 0) / prices.length;
  const gross = prices.reduce((sum, p) => sum + p.gross, 0) / prices.length;
  return { net: Math.round(net), tax: net > 0 ? gross / net - 1 : 0 };
}

const PRICE_BASIS_STORAGE_KEY = "purchase.subProductPriceBasis";

const loadPriceBasis = (): SubProductPriceBasis => {
  try {
    return localStorage.getItem(PRICE_BASIS_STORAGE_KEY) === "average"
      ? "average"
      : "max";
  } catch {
    return "max";
  }
};

export const PurchaseItemOverview = (props: { product: ProductDto }) => {
  const { t } = useTranslation();

  const [inputCurrentPrice, setInputCurrentPrice] = React.useState(0);
  const [inputPurchasePrice, setInputPurchasePrice] = React.useState(0);
  const [inputTargetProfitPercent, setInputTargetProfitPercent] =
    React.useState(15);
  const [priceBasis, setPriceBasis] =
    React.useState<SubProductPriceBasis>(loadPriceBasis);

  const { isLoading, getLastPurchase, getLastPurchasesBySubProduct } =
    usePurchaseHistory();
  const lastPurchase = getLastPurchase(props.product.id);

  // Latest unit price of every active sub product that was bought already.
  const lastBySub = getLastPurchasesBySubProduct(props.product.id);
  const subProductPrices: SubProductPrice[] = props.product.sub_products
    .filter((sub) => sub.active)
    .flatMap((sub) => {
      const last = lastBySub.get(sub.id);
      if (!last) {
        return [];
      }
      const net = unitPriceCents(last.container_cents, last.container_size);
      return [{ sub, last, net, gross: net * (1 + sub.purchase_tax / 100) }];
    });
  const basis = subProductPriceBasis(subProductPrices, priceBasis);
  const basisKey = basis ? `${priceBasis}:${basis.net}:${basis.tax}` : "";

  useEffect(() => {
    if (basis) {
      setInputPurchasePrice(basis.net);
    } else if (lastPurchase) {
      setInputPurchasePrice(
        unitPriceCents(
          lastPurchase.container_cents,
          lastPurchase.container_size
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPurchase?.purchaseId, basisKey, setInputPurchasePrice]);

  useEffect(() => {
    setInputCurrentPrice(props.product.price.Cent ?? 0);
  }, [props.product, setInputCurrentPrice]);

  if (isLoading) {
    return <PaperScreenLoader />;
  }

  const changePriceBasis = (next: SubProductPriceBasis | null) => {
    if (!next) {
      return;
    }
    setPriceBasis(next);
    try {
      localStorage.setItem(PRICE_BASIS_STORAGE_KEY, next);
    } catch {
      // Only a convenience; the toggle works without remembering it.
    }
  };

  const result = calculateProductPriceOverview(
    inputCurrentPrice,
    inputPurchasePrice,
    inputTargetProfitPercent / 100,
    basis ? basis.tax : props.product.purchase_tax / 100
  );

  return (
    <Grid container sx={{ p: 2 }} spacing={2}>
      {subProductPrices.length > 0 ? (
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="subtitle2">
              {t("purchase.productOverview.subProductPrices")}
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={priceBasis}
              onChange={(e, next) => changePriceBasis(next)}
              aria-label={t("purchase.productOverview.priceBasis") ?? ""}
            >
              <ToggleButton value="max">
                {t("purchase.productOverview.priceBasisMax")}
              </ToggleButton>
              <ToggleButton value="average">
                {t("purchase.productOverview.priceBasisAverage")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <StyledTable>
            <tbody>
              {subProductPrices.map((price) => (
                <tr key={price.sub.id}>
                  <td>
                    {price.sub.name}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {percentToString(price.sub.purchase_tax / 100)} ·{" "}
                      {dateFormat.format(new Date(price.last.timestamp))}
                    </Typography>
                  </td>
                  <td>
                    <small>{moneyToString(price.net)}</small>
                    {moneyToString(Math.round(price.gross))}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Grid>
      ) : null}
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
              <small>{percentToString(result.purchaseTax)}</small>
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
