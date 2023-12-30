import React from "react";
import { Money } from "../components/Money";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import { CoffeeStamp } from "../../assets/CoffeeStamp";
import { BottleStamp } from "../../assets/BottleStamp";
import { addPaymentItem } from "../redux/features/paymentSlice";
import styled from "@emotion/styled";
import {
  getActivePrice,
  getOriginalPriceIfStatusApplies,
  parseQuickAccessPosition,
} from "../../common/statusPriceUtils";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import { ProductDto } from "../../common/contracts";

const StyledQuickAccess = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  padding: 0.6em;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
`;

const StyledQuickAccessRow = styled.div`
  display: flex;
  flex: 1 1 0;
  gap: 0.6em;

  &:last-child {
    flex-grow: 0.9;
  }
`;

const StyledQuickAccessEntry = styled.div`
  flex: 1 1 0;
  padding: 0.5em;

  position: relative;
  background-color: var(--primary-background);
  border: solid 1px var(--border-color);

  &:hover {
    background-color: var(--primary-hover-background);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  img {
    width: 1.2em;
    height: 1.2em;
  }

  &.group-bottle::before {
    background: linear-gradient(
      155deg,
      rgba(0, 0, 0, 0) 75%,
      var(--bottle-color) 75%,
      var(--bottle-color) 100%
    );
  }

  &.group-stamp {
    border-radius: 100%;
    border-width: 4px;

    .quick-access-entry-name {
      top: 12% !important;
    }

    .quick-access-entry-center {
      top: 30% !important;
    }
  }

  &.group-coffee::before {
    background: linear-gradient(
      155deg,
      rgba(0, 0, 0, 0) 75%,
      var(--coffee-color) 75%,
      var(--coffee-color) 100%
    );
  }

  &.group-cup::before {
    background: linear-gradient(
      155deg,
      rgba(0, 0, 0, 0) 75%,
      var(--cup-color) 75%,
      var(--cup-color) 100%
    );
  }

  &.bottle-stamp,
  &.bottle-free {
    border-color: var(--bottle-color);
  }

  &.coffee-stamp,
  &.coffee-free {
    border-color: var(--coffee-color);
  }

  &.dark {
    img {
      filter: invert(1);
    }
  }
`;

const StyledQuickAccessEntryCenter = styled.div`
  position: absolute;
  left: 0;
  top: 15%;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
`;

const StyledQuickAccessEntryExtra = styled.div`
  position: absolute;
  right: -0.4em;
  bottom: -0.4em;
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  border-radius: 100%;
  z-index: 1;

  span {
    display: none;
  }

  .quick-access-entry-stamp svg {
    margin-left: 0 !important;
    width: 0.9em;
    height: 0.9em;
  }
`;
const StyledQuickAccessEntryName = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0.5em;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-size: 0.9em;
  text-align: center;
  line-height: 1.2em;
`;

const StyledQuickAccessEntryStamp = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 0.4em;
    width: 0.8em;
    height: 0.8em;
  }
`;

const StyledPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledPriceOld = styled.div`
  position: relative;
  font-size: 0.6em;
  color: var(--secondary-text-color);
  margin-top: -0.1em;
  margin-bottom: -0.1em;

  &::after {
    content: "";
    position: absolute;
    left: -0.2em;
    right: -0.2em;
    top: 50%;
    margin-top: -0.1em;
    border-bottom: solid 0.14em var(--secondary-text-color);
  }
`;

export const QuickAccess = () => {
  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  if (isLoading) {
    return <></>;
  }

  if (isError || !products) {
    return <></>;
  }

  let quickAccessProducts = products.filter(
    (p) => p.category === "QuickAccess"
  );
  quickAccessProducts.sort((a, b) => a.name.localeCompare(b.name));

  const content: React.ReactElement[] = [];

  let lastRow = 0;
  let currentRowContent: React.ReactElement[] = [];
  for (let product of quickAccessProducts) {
    let { row, col } = parseQuickAccessPosition(product);

    if (row !== lastRow) {
      content.push(
        <StyledQuickAccessRow key={lastRow}>
          {currentRowContent}
        </StyledQuickAccessRow>
      );
      lastRow = row;
      currentRowContent = [];
    }

    currentRowContent.push(
      <QuickAccessEntryView key={col} product={product} />
    );
  }

  if (currentRowContent.length > 0) {
    content.push(
      <StyledQuickAccessRow key={lastRow}>
        {currentRowContent}
      </StyledQuickAccessRow>
    );
  }

  return <StyledQuickAccess>{content}</StyledQuickAccess>;
};

const QuickAccessEntryView = (props: { product: ProductDto }) => {
  const dispatch = useTerminalDispatch();
  const scannedAccount = useTerminalSelector(
    (state) => state.paymentState.scannedAccount
  );

  let stamp: any | null = null;
  if (props.product.price.CoffeeStamp && props.product.price.CoffeeStamp > 0) {
    stamp = (
      <StyledQuickAccessEntryStamp
        key="coffee-10"
        className="quick-access-entry-stamp"
      >
        <span>-{props.product.price.CoffeeStamp}</span>
        <CoffeeStamp />
      </StyledQuickAccessEntryStamp>
    );
  } else if (
    props.product.price.BottleStamp &&
    props.product.price.BottleStamp > 0
  ) {
    stamp = (
      <StyledQuickAccessEntryStamp
        key="bottle-10"
        className="quick-access-entry-stamp"
      >
        <span>-{props.product.price.BottleStamp}</span>
        <BottleStamp />
      </StyledQuickAccessEntryStamp>
    );
  }
  if (props.product.bonus.CoffeeStamp && props.product.bonus.CoffeeStamp > 0) {
    stamp = (
      <StyledQuickAccessEntryStamp
        key="coffee-1"
        className="quick-access-entry-stamp"
      >
        <span>+</span>
        <CoffeeStamp />
      </StyledQuickAccessEntryStamp>
    );
  } else if (
    props.product.bonus.BottleStamp &&
    props.product.bonus.BottleStamp > 0
  ) {
    stamp = (
      <StyledQuickAccessEntryStamp
        key="bottle-1"
        className="quick-access-entry-stamp"
      >
        <span>+</span>
        <BottleStamp />
      </StyledQuickAccessEntryStamp>
    );
  }

  let center: any | null;
  let extra: any | null = null;

  let activePrice = getActivePrice(props.product, scannedAccount);
  let originalPrice = getOriginalPriceIfStatusApplies(
    props.product,
    scannedAccount
  );

  if (props.product.price.Cent || props.product.bonus.Cent) {
    center = (
      <StyledPrice>
        {originalPrice === null ? null : (
          <StyledPriceOld>
            <Money
              value={
                (originalPrice.price.Cent ?? 0) -
                (originalPrice.bonus.Cent ?? 0)
              }
            />
          </StyledPriceOld>
        )}
        <Money
          value={(activePrice.price.Cent ?? 0) - (activePrice.bonus.Cent ?? 0)}
        />
      </StyledPrice>
    );
    extra = stamp;
  } else {
    center = stamp;
  }

  const onClick = () => {
    dispatch(
      addPaymentItem({
        product: {
          name: getName(props.product),
          price: props.product.price,
          bonus: props.product.bonus,
          status_prices: props.product.status_prices,
        },
        colorHint: getColorHint(props.product),
      })
    );
  };

  return (
    <StyledQuickAccessEntry
      className={getClassName(props.product)}
      onClick={onClick}
    >
      <StyledQuickAccessEntryName className="quick-access-entry-name">
        {getName(props.product)}
      </StyledQuickAccessEntryName>
      {center ? (
        <StyledQuickAccessEntryCenter className="quick-access-entry-center">
          {center}
        </StyledQuickAccessEntryCenter>
      ) : null}
      {extra ? (
        <StyledQuickAccessEntryExtra className="quick-access-entry-extra">
          {extra}
        </StyledQuickAccessEntryExtra>
      ) : null}
    </StyledQuickAccessEntry>
  );
};

function getColorHint(product: ProductDto): string {
  if ((product.price.Cent ?? 0) === 0 && (product.bonus.Cent ?? 0) === 0) {
    return "";
  }
  if (
    (product.price.CoffeeStamp ?? 0) > 0 ||
    (product.bonus.CoffeeStamp ?? 0) > 0
  ) {
    return "coffee";
  }
  if (
    (product.price.BottleStamp ?? 0) > 0 ||
    (product.bonus.BottleStamp ?? 0) > 0
  ) {
    return "bottle";
  }

  return "";
}

function getClassName(product: ProductDto): string {
  if ((product.price.Cent ?? 0) === 0 && (product.bonus.Cent ?? 0) === 0) {
    let suffix = "";
    if ((product.price.CoffeeStamp ?? 0) > 0) {
      suffix = " coffee-free";
    }
    if ((product.bonus.CoffeeStamp ?? 0) > 0) {
      suffix = " coffee-stamp";
    }
    if ((product.price.BottleStamp ?? 0) > 0) {
      suffix = " bottle-free";
    }
    if ((product.bonus.BottleStamp ?? 0) > 0) {
      suffix = " bottle-stamp";
    }

    return "group-stamp" + suffix;
  }
  if (
    (product.price.CoffeeStamp ?? 0) > 0 ||
    (product.bonus.CoffeeStamp ?? 0) > 0
  ) {
    return "group-coffee";
  }
  if (
    (product.price.BottleStamp ?? 0) > 0 ||
    (product.bonus.BottleStamp ?? 0) > 0
  ) {
    return "group-bottle";
  }

  return "group-cup";
}

function getName(product: ProductDto): string {
  return (product.nickname ?? "").replace("~", "\u00AD");
}
