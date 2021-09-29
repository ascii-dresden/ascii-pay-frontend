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

import * as React from 'react';

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
import { useState } from 'react';

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

export default function Keyboard(props: { value: String; onChange: (value: string) => void }) {
  const [keyboardSet, setKeyboardSet] = useState('default');
  const [isCaps, setIsCups] = useState(false);

  const getKeyboardSet = () => {
    if (keyboardSet == 'special') {
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
    switch (char) {
      case 'back': {
        return;
      }
      case 'enter': {
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
        return;
      }
      case 'left': {
        return;
      }
      case 'right': {
        return;
      }
      case 'hide': {
        return;
      }
      case 'clear': {
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
  };

  let set = getKeyboardSet();

  return (
    <div className="keyboard">
      <div className="keyboard-display"></div>
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
