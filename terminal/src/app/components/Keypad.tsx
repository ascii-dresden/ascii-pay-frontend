import * as React from 'react';
import { useState } from 'react';

import { MdAdd, MdBackspace, MdDone } from 'react-icons/md';

import './Keypad.scss';

export function Keypad(props: { value: number; onChange: (value: number) => void; onSubmit: () => void }) {
  function getDisplayString() {
    let abs = Math.abs(props.value);
    let sign = props.value < 0 ? '-' : '';
    let euro = Math.floor(abs / 100).toString();
    let cent = (abs % 100).toString().padStart(2, '0');
    return sign + euro + '.' + cent;
  }

  function onDigitPressed(digit: number) {
    props.onChange(props.value * 10 + (Math.sign(props.value) || 1) * digit);
  }

  function onBackspace() {
    props.onChange(Math.sign(props.value) * Math.floor(Math.abs(props.value / 10)));
  }

  function onNegate() {
    props.onChange(-props.value);
  }

  function onSubmit() {
    props.onSubmit();
    props.onChange(0);
  }

  return (
    <div className="keypad">
      <div className="keypad-display">{getDisplayString()}€</div>
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
