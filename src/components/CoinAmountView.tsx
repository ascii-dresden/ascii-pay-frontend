import bottleStamp from "../assets/getraeke_stempel_icons.svg";
import coffeeStamp from "../assets/kaffe_stempel_icons.svg";
import { CoinAmountDto } from "../redux/api/contracts";
import styled from "@emotion/styled";

const StyledCoinAmountView = styled.div`
  display: flex;
  justify-content: end;
`;

const StyledCoinAmountEntry = styled.div`
  display: flex;
  align-items: center;

  & > span {
    line-height: 1rem;
    padding-right: 0.2rem;
    min-width: 1rem;
  }

  & > img {
    width: 1rem;
  }

  &:not(:first-of-type) {
    margin-left: 0.5rem;
  }
`;

export function centsToString(cents: number): string {
  return (cents / 100).toFixed(2) + " €";
}

export const CoinAmountView = (props: { coins: CoinAmountDto }) => {
  return (
    <StyledCoinAmountView>
      <StyledCoinAmountEntry>
        <span>{centsToString(props.coins.Cent ?? 0)}</span>
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry>
        <span>{props.coins.CoffeeStamp ?? 0}</span>
        <img src={coffeeStamp} />
      </StyledCoinAmountEntry>
      <StyledCoinAmountEntry>
        <span>{props.coins.BottleStamp ?? 0}</span>
        <img src={bottleStamp} />
      </StyledCoinAmountEntry>
    </StyledCoinAmountView>
  );
};
