import { CoinAmountDto } from "../../redux/api/contracts";
import styled from "@emotion/styled";
import { Euro } from "@mui/icons-material";
import { CoffeeStamp } from "../CoffeeStamp";
import { BottleStamp } from "../BottleStamp";
import { useTheme } from "@mui/material";
import React from "react";
import clsx from "clsx";

type StyledCoinAmountViewProps = {
  hoverColor: string;
  successColor: string;
  errorColor: string;
};
const StyledCoinAmountView = styled.div`
  display: flex;
  width: 11.5rem;
  cursor: default;
  user-select: none;
  position: relative;
  isolation: isolate;

  &.isClickable::before {
    content: "";
    display: block;
    position: absolute;
    top: -0.6rem;
    left: -0.2rem;
    right: -0.6rem;
    bottom: -0.6rem;
    background-color: transparent;
    z-index: -1;
    border-radius: 0.2rem;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  &.isClickable:hover::before {
    background-color: ${(props: StyledCoinAmountViewProps) => props.hoverColor};
  }

  .success span {
    font-weight: bold;
    color: ${(props: StyledCoinAmountViewProps) => props.successColor};
  }

  .error {
    font-weight: bold;
    color: ${(props: StyledCoinAmountViewProps) => props.errorColor};
  }

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
  isClickable?: boolean;
}) => {
  const theme = useTheme();

  let centsStyle: string | undefined = undefined;
  if (props.negativeIsError && props.coins.Cent && props.coins.Cent < 0) {
    centsStyle = "error";
  } else if (props.isTransaction && props.coins.Cent && props.coins.Cent < 0) {
    centsStyle = "success";
  }
  let coffeeStampStyle: string | undefined = undefined;
  if (
    props.negativeIsError &&
    props.coins.CoffeeStamp &&
    props.coins.CoffeeStamp < 0
  ) {
    coffeeStampStyle = "error";
  } else if (
    props.isTransaction &&
    props.coins.CoffeeStamp &&
    props.coins.CoffeeStamp < 0
  ) {
    coffeeStampStyle = "success";
  }
  let bottleStampStyle: string | undefined = undefined;
  if (
    props.negativeIsError &&
    props.coins.BottleStamp &&
    props.coins.BottleStamp < 0
  ) {
    bottleStampStyle = "error";
  } else if (
    props.isTransaction &&
    props.coins.BottleStamp &&
    props.coins.BottleStamp < 0
  ) {
    bottleStampStyle = "success";
  }

  return (
    <StyledCoinAmountView
      className={clsx({ isClickable: props.isClickable })}
      hoverColor={theme.palette.action.hover}
      successColor={theme.palette.success.main}
      errorColor={theme.palette.error.main}
    >
      <StyledCoinAmountEntry className={centsStyle}>
        <span>{centsToString(props.coins.Cent ?? 0, props.isTransaction)}</span>
        <Euro />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry className={coffeeStampStyle}>
        <span>
          {stampsToString(props.coins.CoffeeStamp ?? 0, props.isTransaction)}
        </span>
        <CoffeeStamp />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry className={bottleStampStyle}>
        <span>
          {stampsToString(props.coins.BottleStamp ?? 0, props.isTransaction)}
        </span>
        <BottleStamp />
      </StyledCoinAmountEntry>
    </StyledCoinAmountView>
  );
};
