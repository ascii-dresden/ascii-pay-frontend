import { CoinAmountDto } from "../../redux/api/contracts";
import React from "react";
import { InputAdornment, TextField } from "@mui/material";

import { Euro } from "@mui/icons-material";
import { BottleStamp } from "../BottleStamp";
import { CoffeeStamp } from "../CoffeeStamp";
import { CoinInput } from "./CoinInput";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
  display: flex;
  margin-bottom: 1rem;

  & > div:first-of-type {
    flex-grow: 4;
    flex-shrink: 1;
  }

  & > div:not(:first-of-type) {
    flex-grow: 1;
    flex-shrink: 4;
    margin-left: 0.5rem;
  }
`;

const StyledActionDiv = styled.div`
  display: flex;
  align-items: center;
`;

interface CustomProps {
  value: number;
  onChange: (value: number) => void;
}

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

const StampInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    return <CoinInput ref={ref} value={value} onChange={onChange} {...other} />;
  }
);

function cloneCoins(coins: CoinAmountDto): CoinAmountDto {
  let newCoins: CoinAmountDto = {};

  if (coins.Cent && coins.Cent !== 0) {
    newCoins.Cent = coins.Cent;
  }

  if (coins.CoffeeStamp && coins.CoffeeStamp !== 0) {
    newCoins.CoffeeStamp = coins.CoffeeStamp;
  }

  if (coins.BottleStamp && coins.BottleStamp !== 0) {
    newCoins.BottleStamp = coins.BottleStamp;
  }

  return newCoins;
}

export const CoinAmountEdit = (props: {
  label?: string;
  coins: CoinAmountDto;
  onChange: (coins: CoinAmountDto) => void;
  children?: React.ReactNode | React.ReactNode[];
}) => {
  function setCents(value: number) {
    let newCoins = cloneCoins(props.coins);
    if (value == 0) {
      delete newCoins.Cent;
    } else {
      newCoins.Cent = value;
    }
    props.onChange(newCoins);
  }

  function setCoffeeStamps(value: number) {
    let newCoins = cloneCoins(props.coins);
    if (value == 0) {
      delete newCoins.CoffeeStamp;
    } else {
      newCoins.CoffeeStamp = value;
    }
    props.onChange(newCoins);
  }

  function setBottleStamps(value: number) {
    let newCoins = cloneCoins(props.coins);
    if (value == 0) {
      delete newCoins.BottleStamp;
    } else {
      newCoins.BottleStamp = value;
    }
    props.onChange(newCoins);
  }

  return (
    <StyledDiv>
      <TextField
        label={props.label ?? "Money"}
        value={props.coins.Cent ?? 0}
        onChange={setCents as any}
        InputProps={{
          inputComponent: CentInputRef as any,
          endAdornment: (
            <InputAdornment position="end">
              <Euro />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        value={props.coins.CoffeeStamp ?? 0}
        onChange={setCoffeeStamps as any}
        InputProps={{
          inputComponent: StampInputRef as any,
          endAdornment: (
            <InputAdornment position="end">
              <CoffeeStamp />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        value={props.coins.BottleStamp ?? 0}
        onChange={setBottleStamps as any}
        InputProps={{
          inputComponent: StampInputRef as any,
          endAdornment: (
            <InputAdornment position="end">
              <BottleStamp />
            </InputAdornment>
          ),
        }}
      />
      {props.children ? (
        <StyledActionDiv>{props.children}</StyledActionDiv>
      ) : null}
    </StyledDiv>
  );
};
