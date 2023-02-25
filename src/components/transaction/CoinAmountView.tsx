import { CoinAmountDto } from "../../redux/api/contracts";
import styled from "@emotion/styled";
import { Euro } from "@mui/icons-material";
import { CoffeeStamp } from "../CoffeeStamp";
import { BottleStamp } from "../BottleStamp";
import { useTheme } from "@mui/material";
import React from "react";

const StyledCoinAmountView = styled.div`
  display: flex;
  width: 11.5rem;

  svg {
    font-size: 1.1rem !important;
  }
`;

const StyledCoinAmountEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 3.5rem;

  & > span {
    line-height: 1rem;
    padding-right: 0.2rem;
    min-width: 1rem;
    padding-top: 0.1rem;
  }

  &:first-of-type {
    width: 4.5rem;
  }

  &:not(:first-of-type) {
    margin-left: 0.5rem;
  }
`;

function centsToString(cents: number, isTransaction?: boolean): string {
  if (isTransaction) {
    if (cents > 0) {
      return `-${(cents / 100).toFixed(2)}`;
    }
    if (cents < 0) {
      return `+${(-cents / 100).toFixed(2)}`;
    }
  }
  return (cents / 100).toFixed(2);
}

function stampsToString(stamps: number, isTransaction?: boolean): string {
  if (isTransaction) {
    if (stamps > 0) {
      return `-${stamps}`;
    }
    if (stamps < 0) {
      return `+${-stamps}`;
    }
  }
  return stamps.toString();
}

export const CoinAmountView = (props: {
  coins: CoinAmountDto;
  isTransaction?: boolean;
  negativeIsError?: boolean;
}) => {
  const theme = useTheme();

  const errorStyle: React.CSSProperties = {
    color: theme.palette.error.main,
    fontWeight: "bold",
  };

  let centsStyle: React.CSSProperties | undefined = undefined;
  if (props.negativeIsError && props.coins.Cent && props.coins.Cent < 0) {
    centsStyle = errorStyle;
  }
  let coffeeStampStyle: React.CSSProperties | undefined = undefined;
  if (
    props.negativeIsError &&
    props.coins.CoffeeStamp &&
    props.coins.CoffeeStamp < 0
  ) {
    coffeeStampStyle = errorStyle;
  }
  let bottleStampStyle: React.CSSProperties | undefined = undefined;
  if (
    props.negativeIsError &&
    props.coins.BottleStamp &&
    props.coins.BottleStamp < 0
  ) {
    bottleStampStyle = errorStyle;
  }

  return (
    <StyledCoinAmountView>
      <StyledCoinAmountEntry style={centsStyle}>
        <span>{centsToString(props.coins.Cent ?? 0, props.isTransaction)}</span>
        <Euro />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry style={coffeeStampStyle}>
        <span>
          {stampsToString(props.coins.CoffeeStamp ?? 0, props.isTransaction)}
        </span>
        <CoffeeStamp />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry style={bottleStampStyle}>
        <span>
          {stampsToString(props.coins.BottleStamp ?? 0, props.isTransaction)}
        </span>
        <BottleStamp />
      </StyledCoinAmountEntry>
    </StyledCoinAmountView>
  );
};
