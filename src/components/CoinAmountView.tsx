import { CoinAmountDto } from "../redux/api/contracts";
import styled from "@emotion/styled";
import { Euro } from "@mui/icons-material";
import { CoffeeStamp } from "./CoffeeStamp";
import { BottleStamp } from "./BottleStamp";

const StyledCoinAmountView = styled.div`
  display: flex;
  justify-content: end;
  width: 12rem;

  svg {
    font-size: 1.1rem !important;
  }
`;

const StyledCoinAmountEntry = styled.div`
  display: flex;
  align-items: center;

  & > span {
    line-height: 1rem;
    padding-right: 0.2rem;
    min-width: 1rem;
    padding-top: 0.1rem;
  }

  &:not(:first-of-type) {
    margin-left: 0.5rem;
  }
`;

export function centsToString(cents: number): string {
  return (cents / 100).toFixed(2);
}

export const CoinAmountView = (props: { coins: CoinAmountDto }) => {
  return (
    <StyledCoinAmountView>
      <StyledCoinAmountEntry>
        <span>{centsToString(props.coins.Cent ?? 0)}</span>
        <Euro />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry>
        <span>{props.coins.CoffeeStamp ?? 0}</span>
        <CoffeeStamp />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry>
        <span>{props.coins.BottleStamp ?? 0}</span>
        <BottleStamp />
      </StyledCoinAmountEntry>
    </StyledCoinAmountView>
  );
};
