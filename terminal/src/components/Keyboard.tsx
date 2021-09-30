import React, { useState } from 'react';
import './Keyboard.scss';
import {
  MdKeyboardReturn,
  MdKeyboardBackspace,
  MdKeyboardCapslock,
  MdSpaceBar,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardHide,
  MdCancel,
  MdArrowBack,
  MdArrowForward,
} from 'react-icons/md';

const keyboardSets = {
  default: [
    ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'back'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@', 'enter'],
    ['nocaps', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'nocaps'],
    ['&123', 'space', 'left', 'right', 'hide'],
  ],
  'default-caps': [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'back'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '#', 'enter'],
    ['caps', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', ';', ':', '_', 'caps'],
    ['&123', 'space', 'left', 'right', 'hide'],
  ],
  special: [
    ['clear', '!', '?', '@', '§', '$', '%', '1', '2', '3', 'back'],
    ['<-', '&', '/', '*', '+', '(', ')', '4', '5', '6', 'enter'],
    ['->', 'ä', 'ö', 'ü', '€', '{', '}', '7', '8', '9'],
    ['abc', 'left', 'right', 'space', '0', '.', 'hide'],
  ],
  'special-caps': [
    ['clear', '´', '`', "'", '"', '²', '³', '1', '2', '3', 'back'],
    ['<-', '<', '>', '^', '°', '|', '\\', '4', '5', '6', 'enter'],
    ['->', 'Ä', 'Ö', 'Ü', '?', '[', ']', '7', '8', '9'],
    ['abc', 'left', 'right', 'space', '0', '.', 'hide'],
  ],
};

interface KeyProps {
  children: any;
  rowIndex: number;
  charIndex: number;
  onPress: () => void;
}
const Key = (props: KeyProps) => (
  <div
    className={'keyboard-key keyboard-key-' + props.rowIndex + '-' + props.charIndex}
    onClick={() => props.onPress()}
  >
    {props.children}
  </div>
);
Key.displayName = 'Key';

export default function Keyboard() {
  const [keyboardSet, setKeyboardSet] = useState('default');
  const [isCaps, setIsCups] = useState(false);
  const [value, setValue] = useState({ value: '', curosr: 0 });
  const [focusedElement, setFocusedElement] = useState(null as HTMLInputElement | null);

  const bodyOnFocusHandler = (event: FocusEvent) => {
    let activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'INPUT' && activeElement !== focusedElement) {
      let v = activeElement as HTMLInputElement;
      v.setSelectionRange(v.value.length, v.value.length);
      setValue({
        value: v.value,
        curosr: v.selectionStart ?? v.value.length,
      });
      setFocusedElement(v);
    } else if (focusedElement !== null) {
      setValue({
        value: '',
        curosr: 0,
      });
      setFocusedElement(null);
    }
  };

  const bodyOnKey = (event: KeyboardEvent) => {
    if (focusedElement) {
      setValue({
        value: focusedElement.value,
        curosr: focusedElement.selectionStart ?? focusedElement.value.length,
      });
    }
  };

  React.useEffect(() => {
    document.body.addEventListener('focusin', bodyOnFocusHandler);
    document.body.addEventListener('focusout', bodyOnFocusHandler);
    document.body.addEventListener('keydown', bodyOnKey);
    document.body.addEventListener('keypress', bodyOnKey);
    document.body.addEventListener('keyup', bodyOnKey);
    return () => {
      document.body.removeEventListener('focusin', bodyOnFocusHandler);
      document.body.removeEventListener('focusout', bodyOnFocusHandler);
      document.body.removeEventListener('keydown', bodyOnKey);
      document.body.removeEventListener('keypress', bodyOnKey);
      document.body.removeEventListener('keyup', bodyOnKey);
    };
  });

  if (focusedElement === null) {
    return <></>;
  }

  const getKeyboardSet = () => {
    if (keyboardSet === 'special') {
      if (isCaps) {
        return keyboardSets['special-caps'];
      } else {
        return keyboardSets.special;
      }
    }
    if (isCaps) {
      return keyboardSets['default-caps'];
    } else {
      return keyboardSets.default;
    }
  };

  const getChar = (char: string) => {
    switch (char) {
      case 'back': {
        return <MdKeyboardBackspace />;
      }
      case 'enter': {
        return <MdKeyboardReturn />;
      }
      case 'caps': {
        return <MdKeyboardCapslock />;
      }
      case 'nocaps': {
        return <MdKeyboardCapslock />;
      }
      case '<-': {
        return <MdArrowBack />;
      }
      case '->': {
        return <MdArrowForward />;
      }
      case 'space': {
        return <MdSpaceBar />;
      }
      case 'left': {
        return <MdKeyboardArrowLeft />;
      }
      case 'right': {
        return <MdKeyboardArrowRight />;
      }
      case 'hide': {
        return <MdKeyboardHide />;
      }
      case 'clear': {
        return <MdCancel />;
      }
      case 'blank': {
        return '';
      }
    }
    return char;
  };

  const clickChar = (char: string) => {
    let v = focusedElement;
    if (!v) return;

    let s = v.selectionStart ?? 0;
    switch (char) {
      case 'back': {
        if (s > 0) {
          v.value = v.value.substring(0, s - 1) + v.value.substring(s);
          let sx = s - 1;
          v.setSelectionRange(sx, sx);
          setValue({
            value: v.value,
            curosr: v.selectionStart ?? v.value.length,
          });
        }
        return;
      }
      case 'enter': {
        v.blur();
        return;
      }
      case '<-':
      case 'caps': {
        setIsCups(false);
        return;
      }
      case '->':
      case 'nocaps': {
        setIsCups(true);
        return;
      }
      case 'space': {
        v.value = v.value.substring(0, s) + ' ' + v.value.substring(s);
        let sx = s + 1;
        v.setSelectionRange(sx, sx);
        setValue({
          value: v.value,
          curosr: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case 'left': {
        let sx = Math.max(0, s - 1);
        v.setSelectionRange(sx, sx);
        setValue({
          value: v.value,
          curosr: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case 'right': {
        let sx = Math.min(v.value.length, s + 1);
        v.setSelectionRange(sx, sx);
        setValue({
          value: v.value,
          curosr: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case 'hide': {
        v.blur();
        return;
      }
      case 'clear': {
        v.value = '';
        setValue({
          value: v.value,
          curosr: v.selectionStart ?? v.value.length,
        });
        return;
      }
      case 'blank': {
        return;
      }
      case '&123': {
        setKeyboardSet('special');
        return;
      }
      case 'abc': {
        setKeyboardSet('default');
        return;
      }
    }

    v.value = v.value.substring(0, s) + char + v.value.substring(s);
    let sx = s + 1;
    v.setSelectionRange(sx, sx);
    setValue({
      value: v.value,
      curosr: v.selectionStart ?? v.value.length,
    });
  };

  let set = getKeyboardSet();

  let v = value.value;
  if (focusedElement?.type === 'password') {
    v = '•'.repeat(v.length);
  }
  let placeholder = v.length > 0 ? '' : focusedElement?.placeholder ?? '';
  return (
    <div className="keyboard" onMouseDown={(e) => e.preventDefault()}>
      <div className="keyboard-display" data-placeholder={placeholder}>
        <span>{v.substring(0, value.curosr)}</span>
        <span>{v.substring(value.curosr)}</span>
      </div>
      <div className="keyboard-box">
        <div className={'keyboard-body keyboard-mode-default keyboard-set-' + keyboardSet + ' keyboard-caps-' + isCaps}>
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
    </div>
  );
}
