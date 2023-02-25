import { CoinAmountDto } from "../../redux/api/contracts";
import styled from "@emotion/styled";
import { Euro } from "@mui/icons-material";
import { CoffeeStamp } from "../CoffeeStamp";
import { BottleStamp } from "../BottleStamp";

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
}) => {
  return (
    <StyledCoinAmountView>
      <StyledCoinAmountEntry>
        <span>{centsToString(props.coins.Cent ?? 0, props.isTransaction)}</span>
        <Euro />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry>
        <span>
          {stampsToString(props.coins.CoffeeStamp ?? 0, props.isTransaction)}
        </span>
        <CoffeeStamp />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry>
        <span>
          {stampsToString(props.coins.BottleStamp ?? 0, props.isTransaction)}
        </span>
        <BottleStamp />
      </StyledCoinAmountEntry>
    </StyledCoinAmountView>
  );
};
