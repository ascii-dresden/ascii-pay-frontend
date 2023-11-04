import { CoinAmountDto } from "../../../common/contracts";
import React from "react";
import { InputAdornment, TextField } from "@mui/material";

import { Euro } from "@mui/icons-material";
import { BottleStamp } from "../../../assets/BottleStamp";
import { CoffeeStamp } from "../../../assets/CoffeeStamp";
import { CoinInput } from "./CoinInput";
import { styled } from "@mui/material/styles";

const StyledDiv = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: "1rem",
  gap: "0.5rem",

  ["& > div"]: {
    display: "flex",
    columnGap: "0.5rem",
  },

  ["& > div:first-of-type"]: {
    flexGrow: 4,
    flexShrink: 1,
  },

  ["& > div:first-of-type > div"]: {
    flexGrow: 1,
  },

  ["& > div:not(:first-of-type)"]: {
    flexGrow: 1,
    flexShrink: 4,
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",

    ["& > div:first-of-type"]: {
      flexGrow: 1,
      flexShrink: 1,
    },

    ["& > div:not(:first-of-type)"]: {
      flexGrow: 1,
      flexShrink: 4,
    },
  },
}));

const StyledActionDiv = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

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
const TransactionCentInputRef = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { value, onChange, ...other } = props;
    return (
      <CoinInput
        ref={ref}
        value={value}
        onChange={onChange}
        decimalPlaces={2}
        increment={10}
        isTransaction={true}
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
const TransactionStampInputRef = React.forwardRef<
  HTMLInputElement,
  CustomProps
>(function NumericFormatCustom(props, ref) {
  const { value, onChange, ...other } = props;
  return (
    <CoinInput
      ref={ref}
      value={value}
      onChange={onChange}
      isTransaction={true}
      {...other}
    />
  );
});

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
  label?: string | undefined | null;
  coins: CoinAmountDto;
  onChange: (coins: CoinAmountDto) => void;
  children?: React.ReactNode | React.ReactNode[];
  isTransaction?: boolean;
  preventNegate?: boolean;
}) => {
  const maxSelfGivenStamps = 9;

  function setCents(value?: number) {
    let newCoins = cloneCoins(props.coins);
    if (value === undefined) {
      value = -(newCoins.Cent ?? 0);
    }

    if (props.preventNegate && value < 0 && (newCoins.Cent ?? 0) == 0) {
      value = 0;
    }
    if (props.preventNegate && value < 0) {
      value *= -1;
    }
    if (value == 0) {
      delete newCoins.Cent;
    } else {
      newCoins.Cent = value;
    }
    props.onChange(newCoins);
  }

  function setCoffeeStamps(value?: number) {
    let newCoins = cloneCoins(props.coins);
    if (value === undefined) {
      value = -(newCoins.CoffeeStamp ?? 0);
    }

    if (props.preventNegate && value < -maxSelfGivenStamps) {
      value = -maxSelfGivenStamps;
    }
    if (value == 0) {
      delete newCoins.CoffeeStamp;
    } else {
      newCoins.CoffeeStamp = value;
    }
    props.onChange(newCoins);
  }

  function setBottleStamps(value?: number) {
    let newCoins = cloneCoins(props.coins);
    if (value === undefined) {
      value = -(newCoins.BottleStamp ?? 0);
    }

    if (props.preventNegate && value < -maxSelfGivenStamps) {
      value = -maxSelfGivenStamps;
    }
    if (value == 0) {
      delete newCoins.BottleStamp;
    } else {
      newCoins.BottleStamp = value;
    }
    props.onChange(newCoins);
  }

  return (
    <StyledDiv>
      <div>
        <TextField
          label={props.label}
          value={props.coins.Cent ?? 0}
          onChange={setCents as any}
          InputProps={{
            inputComponent: props.isTransaction
              ? (TransactionCentInputRef as any)
              : (CentInputRef as any),
            endAdornment: (
              <InputAdornment position="end" onDoubleClick={() => setCents()}>
                <Euro />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        <TextField
          value={props.coins.CoffeeStamp ?? 0}
          onChange={setCoffeeStamps as any}
          InputProps={{
            inputComponent: props.isTransaction
              ? (TransactionStampInputRef as any)
              : (StampInputRef as any),
            endAdornment: (
              <InputAdornment
                position="end"
                onDoubleClick={() => setCoffeeStamps()}
              >
                <CoffeeStamp />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          value={props.coins.BottleStamp ?? 0}
          onChange={setBottleStamps as any}
          InputProps={{
            inputComponent: props.isTransaction
              ? (TransactionStampInputRef as any)
              : (StampInputRef as any),
            endAdornment: (
              <InputAdornment
                position="end"
                onDoubleClick={() => setBottleStamps()}
              >
                <BottleStamp />
              </InputAdornment>
            ),
          }}
        />
        {props.children ? (
          <StyledActionDiv>{props.children}</StyledActionDiv>
        ) : null}
      </div>
    </StyledDiv>
  );
};
