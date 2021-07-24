import * as React from "react";
import { useState } from "react";

import { MdBackspace, MdDone } from "react-icons/md";

import "./Keypad.scss";

export function Keypad(props: {
    onSubmit: (cents: number) => void
}) {
	const [cents, setCents] = useState(0);

    function getDisplayString() {
        let abs = Math.abs(cents);
        let sign = cents < 0 ? "-" : ""
        let euro = Math.floor(abs / 100).toString();
        let cent = (abs % 100).toString().padStart(2, '0');
        return sign + euro + "." + cent;
    }

    function onDigitPressed(digit: number) {
        setCents(cents * 10 + (Math.sign(cents) || 1) * digit)
    }

    function onBackspace() {
        setCents(Math.sign(cents) * Math.floor(Math.abs(cents / 10)))
    }

    function onNegate() {
        setCents(-cents)
    }

    function onSubmit() {
        props.onSubmit(cents);
        setCents(0)
    }

    return <div className="keypad">
            <div className="keypad-display">{getDisplayString()}€</div>
            <div className="keypad-submit"><MdDone onClick={() => onSubmit()} /></div>
            <div className="keypad-keys">
                <div className="keypad-key" onClick={() => onDigitPressed(7)}>7</div>
                <div className="keypad-key" onClick={() => onDigitPressed(8)}>8</div>
                <div className="keypad-key" onClick={() => onDigitPressed(9)}>9</div>
                <div className="keypad-key" onClick={() => onDigitPressed(4)}>4</div>
                <div className="keypad-key" onClick={() => onDigitPressed(5)}>5</div>
                <div className="keypad-key" onClick={() => onDigitPressed(6)}>6</div>
                <div className="keypad-key" onClick={() => onDigitPressed(1)}>1</div>
                <div className="keypad-key" onClick={() => onDigitPressed(2)}>2</div>
                <div className="keypad-key" onClick={() => onDigitPressed(3)}>3</div>
                <div className="keypad-key" onClick={() => onNegate()}>±</div>
                <div className="keypad-key" onClick={() => onDigitPressed(0)}>0</div>
                <div className="keypad-key" onClick={() => onBackspace()}><MdBackspace /></div>
            </div>
        </div>;
}
