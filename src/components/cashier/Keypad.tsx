import * as React from "react";

import "./Keypad.scss";
import { MdBackspace, MdDone } from "react-icons/md";


interface KeyProps { children: any, onPress: () => void; }
const Key = (props: KeyProps) => <div className="keypad-key" onClick={props.onPress}>{props.children}</div>;
Key.displayName = "Key"

export interface KeypadProps {
    onSubmit: (cents: number) => void
}
export interface KeypadState {
    cents: number
}
export class Keypad extends React.Component<KeypadProps, KeypadState> {
    static displayName = "Keypad"

    constructor(props: KeypadProps) {
        super(props)

        this.state = {
            cents: 0
        }
    }

    getDisplayString() {
        let abs = Math.abs(this.state.cents);
        let sign = this.state.cents < 0 ? "-" : ""
        let euro = Math.floor(abs / 100).toString();
        let cent = (abs % 100).toString().padStart(2, '0');
        return sign + euro + "." + cent;
    }

    onDigitPressed(digit: number) {
        this.setState((state) => ({
            cents: state.cents * 10 + digit
        }))
    }

    onBackspace() {
        this.setState((state) => ({
            cents: Math.floor(state.cents / 10)
        }))
    }

    onNegate() {
        this.setState((state) => ({
            cents: -state.cents
        }))
    }

    onSubmit() {
        this.props.onSubmit(this.state.cents);
        this.setState({
            cents: 0
        })
    }

    render() {
        return <div className="keypad">
            <div className="keypad-display">{this.getDisplayString()}€</div>
            <div className="keypad-submit"><MdDone onClick={() => this.onSubmit()} /></div>
            <div className="keypad-keys">
                <Key onPress={() => this.onDigitPressed(7)}>7</Key>
                <Key onPress={() => this.onDigitPressed(8)}>8</Key>
                <Key onPress={() => this.onDigitPressed(9)}>9</Key>
                <Key onPress={() => this.onDigitPressed(4)}>4</Key>
                <Key onPress={() => this.onDigitPressed(5)}>5</Key>
                <Key onPress={() => this.onDigitPressed(6)}>6</Key>
                <Key onPress={() => this.onDigitPressed(1)}>1</Key>
                <Key onPress={() => this.onDigitPressed(2)}>2</Key>
                <Key onPress={() => this.onDigitPressed(3)}>3</Key>
                <Key onPress={() => this.onNegate()}>-</Key>
                <Key onPress={() => this.onDigitPressed(0)}>0</Key>
                <Key onPress={() => this.onBackspace()}><MdBackspace /></Key>
            </div>
        </div>;
    }
}
