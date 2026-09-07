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
    isTransaction?: boolean;
  }
>((props, ref) => {
  const { value, onChange, decimalPlaces, increment, ...other } = props;
  // MUI passes its own input props (focus handling, aria, …) through when the
  // component is used as `inputComponent`; those handlers must keep working.
  const inherited = other as React.InputHTMLAttributes<HTMLInputElement>;

  // The field has no visible caret and behaves like a digit accumulator, so
  // typing must always append at the end — also after tapping into the
  // middle of the text on a phone.
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const setRefs = React.useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [ref]
  );
  const caretToEnd = () => {
    const element = inputRef.current;
    if (!element || document.activeElement !== element) {
      return;
    }
    const end = element.value.length;
    if (element.selectionStart !== end || element.selectionEnd !== end) {
      element.setSelectionRange(end, end);
    }
  };
  React.useLayoutEffect(caretToEnd);

  /**
   * The field shows the value with its decimal separator inserted, but the
   * value itself is the digit string (cents, permille, …). Typing therefore
   * only ever changes which digits are in the field, so the new value can be
   * derived from the text the browser produced — no matter whether that came
   * from a hardware key, an Android soft keyboard (which reports keydown as
   * `Unidentified`), autocomplete or a drag & drop. The sign is kept, it is
   * only changed via the minus key.
   */
  const onTextChanged = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    const magnitude = digits === "" ? 0 : parseInt(digits, 10);
    const sign = value < 0 ? -1 : 1;
    onChange(validateValue(sign * magnitude));
  };

  const onNegate = () => {
    let newValue = -value;
    onChange(validateValue(newValue));
  };

  const onIncrement = (incrementOverride?: number) => {
    let offset = incrementOverride ?? increment ?? 1;
    let newValue = value + offset;
    onChange(validateValue(newValue));
  };

  const onDecrement = (incrementOverride?: number) => {
    let offset = incrementOverride ?? increment ?? 1;
    let newValue = value - offset;
    onChange(validateValue(newValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Digits and Backspace are handled by the browser and picked up in
    // `onChange`; only the keys without a text representation are handled
    // here.
    switch (e.key) {
      case "-":
        e.preventDefault();
        onNegate();
        break;
      case "ArrowUp":
      case "ArrowRight":
        e.preventDefault();
        onIncrement();
        break;
      case "ArrowDown":
      case "ArrowLeft":
        e.preventDefault();
        onDecrement();
        break;
      case "PageUp":
        e.preventDefault();
        onIncrement(10);
        break;
      case "PageDown":
        e.preventDefault();
        onDecrement(10);
        break;
    }
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let newValue = parseFloat(
      e.clipboardData.getData("Text").replace(",", ".")
    );
    let places = decimalPlaces ?? 0;

    if (places > 0) {
      newValue = newValue * Math.pow(10, places);
    }
    if (Number.isNaN(newValue)) {
      return;
    }
    onChange(validateValue(Math.round(newValue)));
  };

  let stringValue;
  if (props.isTransaction && value > 0) {
    stringValue =
      "-" +
      (value / Math.pow(10, decimalPlaces ?? 0)).toFixed(decimalPlaces ?? 0);
  } else if (props.isTransaction && value < 0) {
    stringValue =
      "+" +
      (-value / Math.pow(10, decimalPlaces ?? 0)).toFixed(decimalPlaces ?? 0);
  } else {
    stringValue = (value / Math.pow(10, decimalPlaces ?? 0)).toFixed(
      decimalPlaces ?? 0
    );
  }

  return (
    <StyledInput
      ref={setRefs}
      // `inputMode` opens the digit keypad on phones instead of the full
      // keyboard; the field never accepts anything but digits anyway.
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      {...other}
      value={stringValue}
      onChange={(e) => onTextChanged(e.target.value)}
      onKeyDown={(e) => {
        // MUI (or the consumer) may pass its own handler through `other`.
        inherited.onKeyDown?.(e);
        handleKeyDown(e);
      }}
      onPasteCapture={handleOnPaste}
      onFocus={(e) => {
        inherited.onFocus?.(e);
        caretToEnd();
      }}
      onSelect={(e) => {
        inherited.onSelect?.(e);
        caretToEnd();
      }}
      onMouseUp={(e) => {
        inherited.onMouseUp?.(e);
        caretToEnd();
      }}
    />
  );
});
