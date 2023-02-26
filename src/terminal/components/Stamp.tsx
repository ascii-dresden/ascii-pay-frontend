import React from "react";
import styled from "@emotion/styled";
import { CoinTypeDto } from "../../redux/api/contracts";
import { BottleStamp } from "../../components/BottleStamp";
import { CoffeeStamp } from "../../components/CoffeeStamp";

const StyledStamp = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.4rem;
  }
`;

function isNumeric(n: any): n is number | string {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default function Stamp(props: {
  value: number | string | any;
  type: CoinTypeDto;
}) {
  let value = isNumeric(props.value)
    ? props.value > 0
      ? "+" + props.value
      : props.value.toString()
    : props.value;
  let icon = props.type === "BottleStamp" ? <BottleStamp /> : <CoffeeStamp />;

  return (
    <StyledStamp>
      <span>{value}</span>
      {icon}
    </StyledStamp>
  );
}
