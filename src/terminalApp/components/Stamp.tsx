import React from "react";
import styled from "@emotion/styled";
import { CoinTypeDto } from "../../common/contracts";
import { BottleStamp } from "../../assets/BottleStamp";
import { CoffeeStamp } from "../../assets/CoffeeStamp";

const StyledStamp = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1em;
    height: 1em;
    margin-left: 0.4em;
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
