import * as React from "react";
import { Money } from "../components/Money";
import { Backspace, ForwardOutlined } from "@mui/icons-material";
import styled from "@emotion/styled";

const StyledKeypadDisplay = styled.div`
  line-height: 4rem;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  font-size: 1.5rem;
`;
const StyledKeypadSubmit = styled.div`
  position: absolute;

  top: 0;
  right: 0;
  padding-right: 0.5rem;

  svg {
    margin: 1.5rem;
    width: 2rem;
    height: 2rem;
  }
`;
const StyledKeypadKeys = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto auto;
  position: absolute;
  left: 0.6rem;
  top: 5rem;
  right: 0.6rem;
  bottom: 0.6rem;
  gap: 0.6rem;
`;
const StyledKeypadKey = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  font-size: 1.6rem;

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    background-color: var(--primary-hover-background);
  }
`;

const MAX = 999_999;
const MIN = -999_999;

function validateValue(value: number): number {
  return Math.max(MIN, Math.min(MAX, value));
}

export const Keypad = (props: {
  value: number;
  onChange: (value: number) => void;
  onSubmit: (value: number) => void;
}) => {
  const onDigitPressed = (digit: number) => {
    let newValue = props.value * 10 + (Math.sign(props.value) || 1) * digit;
    props.onChange(validateValue(newValue));
  };

  const onBackspace = () => {
    let newValue =
      Math.sign(props.value) * Math.floor(Math.abs(props.value / 10));
    props.onChange(validateValue(newValue));
  };

  const onNegate = () => {
    let newValue = -props.value;
    props.onChange(validateValue(newValue));
  };

  const onSubmit = () => {
    props.onSubmit(props.value);
  };

  return (
    <div>
      <StyledKeypadDisplay>
        <Money value={props.value} />
      </StyledKeypadDisplay>
      <StyledKeypadSubmit>
        <ForwardOutlined onClick={() => onSubmit()} />
      </StyledKeypadSubmit>
      <StyledKeypadKeys>
        <StyledKeypadKey onClick={() => onDigitPressed(7)}>7</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(8)}>8</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(9)}>9</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(4)}>4</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(5)}>5</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(6)}>6</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(1)}>1</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(2)}>2</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(3)}>3</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onNegate()}>±</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onDigitPressed(0)}>0</StyledKeypadKey>
        <StyledKeypadKey onClick={() => onBackspace()}>
          <Backspace />
        </StyledKeypadKey>
      </StyledKeypadKeys>
    </div>
  );
};
