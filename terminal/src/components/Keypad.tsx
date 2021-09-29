import * as React from 'react';

import { MdAdd, MdBackspace } from 'react-icons/md';
import Money from '../Money';

import './Keypad.scss';

export default function Keypad(props: {
  value: number;
  onChange: (value: number) => void;
  onSubmit: (value: number) => void;
}) {
  const onDigitPressed = (digit: number) => {
    props.onChange(props.value * 10 + (Math.sign(props.value) || 1) * digit);
  };

  const onBackspace = () => {
    props.onChange(Math.sign(props.value) * Math.floor(Math.abs(props.value / 10)));
  };

  const onNegate = () => {
    props.onChange(-props.value);
  };

  const onSubmit = () => {
    props.onSubmit(props.value);
  };

  return (
    <div className="keypad">
      <div className="keypad-display">
        <Money value={props.value} />
      </div>
      <div className="keypad-submit">
        <MdAdd onClick={() => onSubmit()} />
      </div>
      <div className="keypad-keys">
        <div className="keypad-key" onClick={() => onDigitPressed(7)}>
          7
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(8)}>
          8
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(9)}>
          9
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(4)}>
          4
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(5)}>
          5
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(6)}>
          6
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(1)}>
          1
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(2)}>
          2
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(3)}>
          3
        </div>
        <div className="keypad-key" onClick={() => onNegate()}>
          ±
        </div>
        <div className="keypad-key" onClick={() => onDigitPressed(0)}>
          0
        </div>
        <div className="keypad-key" onClick={() => onBackspace()}>
          <MdBackspace />
        </div>
      </div>
    </div>
  );
}
