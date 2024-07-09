import {
  ArrowBack,
  ArrowForward,
  Cancel,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardBackspace,
  KeyboardCapslock,
  KeyboardHide,
  KeyboardReturn,
  SpaceBar,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import styled from "@emotion/styled";
import clsx from "clsx";

const StyledKeyboard = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;

  @keyframes cursor-blink {
    0% {
      opacity: 1;
    }
    52% {
      opacity: 0;
    }
  }

  .keyboard-display {
    position: absolute;
    left: 0;
    right: 0;
    height: 3em;
    bottom: 16.6em;
    background-color: var(--primary-background);
    border-top: solid 1px var(--border-color);
    border-top: solid 1px var(--border-color);
    line-height: 3em;
    padding: 0 2em;

    &:before {
      position: absolute;
      content: attr(data-placeholder);
      color: var(--border-color);
    }

    span {
      white-space: pre;
    }

    & > span:first-of-type::after {
      content: "";
      height: 100%;
      border-right: solid 1px var(--theme-color);
      margin-left: -0.8px;
      margin-right: -0.2px;
      animation: cursor-blink 0.8s step-end infinite;
    }

    .reveal-toggle {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3em;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.4;
      padding-right: 2em;
      font-size: 0.8em;

      svg {
        width: 0.8em;
      }
    }
  }

  .keyboard-box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 16.6em;
    background-color: var(--tertiary-background);
  }

  .keyboard-body {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    padding: 0.3em 0;
  }

  .keyboard-row {
    position: relative;
    width: 100%;
    height: 4em;
    line-height: 3.4em;
    padding: 0 0.5%;
    opacity: 1;
  }

  .keyboard-key {
    background-color: var(--secondary-background);
    text-align: center;
    display: block;
    float: left;
    width: 7.33%;
    height: 3.4em;
    margin: 0.3em 0.5%;
    overflow: hidden;
    border: solid 1px var(--border-color);
    box-sizing: border-box;
    transition: border 0.4s, background-color 0.4s, color 0.4s;
    position: relative;

    &.inactive {
      color: var(--secondary-text-color);
    }

    &.blank {
      visibility: hidden;
    }

    &::after {
      position: absolute;
      display: block;
      content: attr(data-second);
      top: 0;
      right: 0.4em;
      font-size: 0.6em;
      line-height: 1.2em;
    }

    svg {
      width: 0.7em;
      height: 0.7em;
    }

    &.flash {
      animation: flash-background 500ms ease;
    }

    @keyframes flash-background {
      0% {
        background-color: var(--tertiary-background);
      }
      100% {
        background-color: var(--secondary-background);
      }
    }
  }

  .keyboard-mode-default {
    width: 49em;
    margin-left: -24.5em;

    &.keyboard-set-default {
      .keyboard-key-0-10 {
        width: 15.66% !important;
      }

      .keyboard-key-1-0 {
        margin-left: 4.66% !important;
      }

      .keyboard-key-1-10 {
        width: 11.5% !important;
      }

      .keyboard-key-3-1 {
        width: 65.64% !important;
      }
    }

    &.keyboard-set-special {
      .keyboard-key-0-6,
      .keyboard-key-0-9,
      .keyboard-key-1-6,
      .keyboard-key-1-9,
      .keyboard-key-2-6,
      .keyboard-key-2-9 {
        margin-right: 4.66% !important;
      }

      .keyboard-key-1-10 {
        position: absolute !important;
        height: 7.4em !important;
        right: 0.55% !important;
        padding-top: 1.96em !important;
        z-index: 1;
      }

      .keyboard-key-3-3 {
        width: 32.32% !important;
        margin-right: 4.66% !important;
      }

      .keyboard-key-3-4 {
        width: 15.66% !important;
      }

      .keyboard-key-3-5 {
        margin-right: 4.66% !important;
      }
    }
  }
`;

const keyboardSets = {
  default: [
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "back"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "@", "enter"],
    ["nocaps", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-", "nocaps"],
    ["&123", "space", "left", "right", "hide"],
  ],
  "default-caps": [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "back"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "#", "enter"],
    ["caps", "Y", "X", "C", "V", "B", "N", "M", ";", ":", "_", "caps"],
    ["&123", "space", "left", "right", "hide"],
  ],
  special: [
    ["clear", "!", "?", "@", "§", "$", "%", "1", "2", "3", "back"],
    ["<-", "&", "/", "*", "+", "(", ")", "4", "5", "6", "enter"],
    ["->", "ä", "ö", "ü", "€", "{", "}", "7", "8", "9"],
    ["abc", "left", "right", "space", "0", ".", "hide"],
  ],
  "special-caps": [
    ["clear", "´", "`", "'", '"', "²", "³", "1", "2", "3", "back"],
    ["<-", "<", ">", "^", "°", "|", "\\", "4", "5", "6", "enter"],
    ["->", "Ä", "Ö", "Ü", "?", "[", "]", "7", "8", "9"],
    ["abc", "left", "right", "space", "0", ".", "hide"],
  ],
};

export const Keyboard = () => {
  const [keyboardSet, setKeyboardSet] = useState("default");
  const [isCaps, setIsCups] = useState(false);
  const [value, setValue] = useState({ value: "", cursor: 0 });
  const [revealPassword, setRevealPassword] = useState(false);
  const [focusedElement, setFocusedElement] = useState(
    null as HTMLInputElement | null
  );

  React.useEffect(() => {
    setRevealPassword(false);
  }, [focusedElement]);

  const bodyOnFocusHandler = () => {
    let activeElement = document.activeElement;
    if (
      activeElement &&
      activeElement.tagName === "INPUT" &&
      activeElement !== focusedElement &&
      !(activeElement as HTMLInputElement).readOnly
    ) {
      let v = activeElement as HTMLInputElement;
      v.setSelectionRange(v.value.length, v.value.length);
      setValue({
        value: v.value,
        cursor: v.selectionStart ?? v.value.length,
      });
      setFocusedElement(v);
    } else if (focusedElement !== null) {
      setValue({
        value: "",
        cursor: 0,
      });
      setFocusedElement(null);
    }
  };

  const bodyOnKey = () => {
    if (focusedElement) {
      setValue({
        value: focusedElement.value,
        cursor: focusedElement.selectionStart ?? focusedElement.value.length,
      });
    }
  };

  React.useEffect(() => {
    document.body.addEventListener("focusin", bodyOnFocusHandler);
    document.body.addEventListener("focusout", bodyOnFocusHandler);
    document.body.addEventListener("keydown", bodyOnKey);
    document.body.addEventListener("keypress", bodyOnKey);
    document.body.addEventListener("keyup", bodyOnKey);
    return () => {
      document.body.removeEventListener("focusin", bodyOnFocusHandler);
      document.body.removeEventListener("focusout", bodyOnFocusHandler);
      document.body.removeEventListener("keydown", bodyOnKey);
      document.body.removeEventListener("keypress", bodyOnKey);
      document.body.removeEventListener("keyup", bodyOnKey);
    };
  });

  if (focusedElement === null) {
    return <></>;
  }

  const getKeyboardSet = () => {
    if (keyboardSet === "special") {
      if (isCaps) {
        return keyboardSets["special-caps"];
      } else {
        return keyboardSets.special;
      }
    }
    if (isCaps) {
      return keyboardSets["default-caps"];
    } else {
      return keyboardSets.default;
    }
  };

  const getChar = (char: string) => {
    switch (char) {
      case "back": {
        return <KeyboardBackspace />;
      }
      case "enter": {
        return <KeyboardReturn />;
      }
      case "caps": {
        return <KeyboardCapslock />;
      }
      case "nocaps": {
        return <KeyboardCapslock />;
      }
      case "<-": {
        return <ArrowBack />;
      }
      case "->": {
        return <ArrowForward />;
      }
      case "space": {
        return <SpaceBar />;
      }
      case "left": {
        return <KeyboardArrowLeft />;
      }
      case "right": {
        return <KeyboardArrowRight />;
      }
      case "hide": {
        return <KeyboardHide />;
      }
      case "clear": {
        return <Cancel />;
      }
      case "blank": {
        return "";
      }
    }
    return char;
  };

  const clickChar = (char: string) => {
    let v = focusedElement;
    if (!v) return;

    let s = v.selectionStart ?? 0;
    switch (char) {
      case "back": {
        if (s > 0) {
          v.value = v.value.substring(0, s - 1) + v.value.substring(s);
          let sx = s - 1;
          v.setSelectionRange(sx, sx);
          setValue({
            value: v.value,
            cursor: v.selectionStart ?? v.value.length,
          });
        }
        return;
      }
      case "enter": {
        v.blur();
        return;
      }
      case "<-":
      case "caps": {
        setIsCups(false);
        return;
      }
      case "->":
      case "nocaps": {
        setIsCups(true);
        return;
      }
      case "space": {
        v.value = v.value.substring(0, s) + " " + v.value.substring(s);
        let sx = s + 1;
        v.setSelectionRange(sx, sx);
        setValue({
          value: v.value,
          cursor: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case "left": {
        let sx = Math.max(0, s - 1);
        v.setSelectionRange(sx, sx);
        setValue({
          value: v.value,
          cursor: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case "right": {
        let sx = Math.min(v.value.length, s + 1);
        v.setSelectionRange(sx, sx);
        setValue({
          value: v.value,
          cursor: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case "hide": {
        v.blur();
        return;
      }
      case "clear": {
        v.value = "";
        setValue({
          value: v.value,
          cursor: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case "blank": {
        return;
      }
      case "&123": {
        setKeyboardSet("special");
        return;
      }
      case "abc": {
        setKeyboardSet("default");
        return;
      }
    }

    v.value = v.value.substring(0, s) + char + v.value.substring(s);
    let sx = s + 1;
    v.setSelectionRange(sx, sx);
    setValue({
      value: v.value,
      cursor: v.selectionStart ?? v.value.length,
    });
  };

  let set = getKeyboardSet();

  let v = value.value;
  if (focusedElement?.type === "password" && !revealPassword) {
    v = "•".repeat(v.length);
  }
  let placeholder = v.length > 0 ? "" : focusedElement?.placeholder ?? "";

  let revealToggle;
  if (focusedElement?.type === "password") {
    revealToggle = (
      <div
        onClick={() => setRevealPassword((v) => !v)}
        className="reveal-toggle"
      >
        {revealPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
      </div>
    );
  } else {
    revealToggle = null;
  }

  return (
    <StyledKeyboard onMouseDown={(e) => e.preventDefault()}>
      <div className="keyboard-display" data-placeholder={placeholder}>
        <span>{v.substring(0, value.cursor)}</span>
        <span>{v.substring(value.cursor)}</span>
        {revealToggle}
      </div>
      <div className="keyboard-box">
        <div
          className={
            "keyboard-body keyboard-mode-default keyboard-set-" +
            keyboardSet +
            " keyboard-caps-" +
            isCaps
          }
        >
          {set.map((row, rowIndex) => (
            <div key={rowIndex.toString()} className="keyboard-row">
              {row.map((char, charIndex) => (
                <Key
                  key={charIndex.toString()}
                  onPress={() => clickChar(char)}
                  rowIndex={rowIndex}
                  charIndex={charIndex}
                >
                  {getChar(char)}
                </Key>
              ))}
            </div>
          ))}
        </div>
      </div>
    </StyledKeyboard>
  );
};

const Key = (props: {
  children: any;
  rowIndex: number;
  charIndex: number;
  onPress: () => void;
}) => {
  const [flash, setFlash] = React.useState(false);

  const clickHandler = React.useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
    props.onPress();
  }, [setFlash, props.onPress]);

  return (
    <div
      className={clsx(
        "keyboard-key keyboard-key-" + props.rowIndex + "-" + props.charIndex,
        { flash: flash }
      )}
      onClick={clickHandler}
    >
      {props.children}
    </div>
  );
};
