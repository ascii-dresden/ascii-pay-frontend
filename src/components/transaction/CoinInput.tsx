import React from "react";
import styled from "@emotion/styled";

const MAX = 999_999_999;
const MIN = -999_999_999;

const StyledInput = styled.input`
  appearance: none;
  border: none;
  outline: none;
  font: inherit;
  letter-spacing: inherit;
  border: 0;
  box-sizing: content-box;
  background: none;
  height: 1.4375em;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  display: block;
  min-width: 0;
  width: 100%;
  -webkit-animation-name: mui-auto-fill-cancel;
  animation-name: mui-auto-fill-cancel;
  -webkit-animation-duration: 10ms;
  animation-duration: 10ms;
  padding: 16.5px 0 16.5px 14px;
  caret-color: transparent;
  text-align: center;
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace !important;
`;

function validateValue(value: number): number {
  return Math.max(MIN, Math.min(MAX, value));
}

export const CoinInput = React.forwardRef<
  HTMLInputElement,
  {
    value: number;
    onChange: (value: number) => void;
    decimalPlaces?: number;
    increment?: number;
  }
>((props, ref) => {
  const { value, onChange, decimalPlaces, increment, ...other } = props;

  const onDigitPressed = (digit: number) => {
    let newValue = value * 10 + (Math.sign(value) || 1) * digit;
    onChange(validateValue(newValue));
  };

  const onBackspace = () => {
    let newValue = Math.sign(value) * Math.floor(Math.abs(value / 10));
    onChange(validateValue(newValue));
  };

  const onNegate = () => {
    let newValue = -value;
    onChange(validateValue(newValue));
  };

  const onIncrement = () => {
    let newValue = value + (increment ?? 1);
    onChange(validateValue(newValue));
  };

  const onDecrement = () => {
    let newValue = value - (increment ?? 1);
    onChange(validateValue(newValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "0":
        onDigitPressed(0);
        break;
      case "1":
        onDigitPressed(1);
        break;
      case "2":
        onDigitPressed(2);
        break;
      case "3":
        onDigitPressed(3);
        break;
      case "4":
        onDigitPressed(4);
        break;
      case "5":
        onDigitPressed(5);
        break;
      case "6":
        onDigitPressed(6);
        break;
      case "7":
        onDigitPressed(7);
        break;
      case "8":
        onDigitPressed(8);
        break;
      case "9":
        onDigitPressed(9);
        break;
      case "Backspace":
        onBackspace();
        break;
      case "-":
        onNegate();
        break;
      case "ArrowUp":
      case "ArrowRight":
        onIncrement();
        break;
      case "ArrowDown":
      case "ArrowLeft":
        onDecrement();
        break;
    }
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    let newValue = parseFloat(
      e.clipboardData.getData("Text").replace(",", ".")
    );
    let places = decimalPlaces ?? 0;

    if (places > 0) {
      newValue = newValue * Math.pow(10, places);
    }
    onChange(validateValue(Math.round(newValue)));
  };

  return (
    <StyledInput
      ref={ref}
      {...other}
      value={(value / Math.pow(10, decimalPlaces ?? 0)).toFixed(
        decimalPlaces ?? 0
      )}
      onChange={(_) => {}}
      onKeyDown={handleKeyDown}
      onPasteCapture={handleOnPaste}
    />
  );
});
