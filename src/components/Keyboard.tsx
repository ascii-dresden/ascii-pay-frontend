
const keyboardSets = {
    "default": {
        "default": [
            ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "back"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", "@", "enter"],
            ["nocaps", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-", "nocaps"],
            ["&123", "space", "left", "right", "hide"]
        ],
        "default-caps": [
            ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "back"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "#", "enter"],
            ["caps", "Y", "X", "C", "V", "B", "N", "M", ";", ":", "_", "caps"],
            ["&123", "space", "left", "right", "hide"]
        ],
        "special": [
            ["clear", "!", "?", "@", "§", "$", "%", "1", "2", "3", "back"],
            ["<-", "&", "/", "*", "+", "(", ")", "4", "5", "6", "enter"],
            ["->", "ä", "ö", "ü", "€", "{", "}", "7", "8", "9"],
            ["abc", "left", "right", "space", "0", ".", "hide"]
        ],
        "special-caps": [
            ["clear", "´", "`", "'", "\"", "²", "³", "1", "2", "3", "back"],
            ["<-", "<", ">", "^", "°", "|", "\\", "4", "5", "6", "enter"],
            ["->", "Ä", "Ö", "Ü", "?", "[", "]", "7", "8", "9"],
            ["abc", "left", "right", "space", "0", ".", "hide"]
        ]
    },
    "pin": [
        ["1", "2", "3", "back"],
        ["4", "5", "6", "enter"],
        ["7", "8", "9"],
        ["blank", "0", "blank", "hide"]
    ],
    "calc": [
        ["+", "-", "1", "2", "3", "back"],
        ["*", "/", "4", "5", "6", "enter"],
        ["%", "^", "7", "8", "9"],
        ["left", "right", "0", ".", "hide"]
    ]
};

import * as React from "react";

import "./Keyboard.scss";
import { MdBackspace, MdKeyboardReturn, MdKeyboardBackspace, MdKeyboardCapslock, MdSpaceBar, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardHide, MdClear, MdCancel, MdArrowBack, MdArrowForward } from "react-icons/md";

interface KeyProps { children: any, rowIndex: number, charIndex: number, onPress: () => void }
const Key = (props: KeyProps) => <div className={"keyboard-key keyboard-key-" + props.rowIndex + "-" + props.charIndex} onClick={() => props.onPress()}>{props.children}</div>;
Key.displayName = "Key"


export enum KeyboardMode {
    Default,
    Pin,
    Calc
}

export interface KeyboardProps {
    mode: KeyboardMode
}
export interface KeyboardState {
    set: string,
    caps: boolean
}

export class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    static displayName = "Keyboard"

    constructor(props: KeyboardProps) {
        super(props)

        this.state = {
            set: "default",
            caps: false
        }
    }

    getKeyboardSet() {
        switch (this.props.mode) {
            case KeyboardMode.Default: {
                if (this.state.set == "special") {
                    if (this.state.caps) {
                        return keyboardSets.default["special-caps"];
                    } else {
                        return keyboardSets.default.special
                    }
                }
                if (this.state.caps) {
                    return keyboardSets.default["default-caps"];
                } else {
                    return keyboardSets.default.default
                }
            }
            case KeyboardMode.Pin: {
                return keyboardSets.pin
            }
            case KeyboardMode.Calc: {
                return keyboardSets.calc
            }
        }
    }

    getChar(char: string) {
        switch (char) {
            case "back": {
                return <MdKeyboardBackspace />
            }
            case "enter": {
                return <MdKeyboardReturn />
            }
            case "caps": {
                return <MdKeyboardCapslock />
            }
            case "nocaps": {
                return <MdKeyboardCapslock />
            }
            case "<-": {
                return <MdArrowBack />
            }
            case "->": {
                return <MdArrowForward />
            }
            case "space": {
                return <MdSpaceBar />
            }
            case "left": {
                return <MdKeyboardArrowLeft />
            }
            case "right": {
                return <MdKeyboardArrowRight />
            }
            case "hide": {
                return <MdKeyboardHide />
            }
            case "clear": {
                return <MdCancel />
            }
            case "blank": {
                return ""
            }
        }
        return char
    }

    clickChar(char: string) {
        switch (char) {
            case "back": {
                return
            }
            case "enter": {
                return
            }
            case "<-":
            case "caps": {
                this.setState({
                    caps: false
                });
                return
            }
            case "->":
            case "nocaps": {
                this.setState({
                    caps: true
                });
                return
            }
            case "space": {
                return
            }
            case "left": {
                return
            }
            case "right": {
                return
            }
            case "hide": {
                return
            }
            case "clear": {
                return
            }
            case "blank": {
                return
            }
            case "&123": {
                this.setState({
                    set: "special"
                });
                return
            }
            case "abc": {
                this.setState({
                    set: "default"
                });
                return
            }
        }
    }

    render() {
        let set = this.getKeyboardSet();

        return <div className="keyboard">
            <div className="keyboard-display"></div>
            <div className="keyboard-box">
                <div className={"keyboard-body keyboard-mode-" + KeyboardMode[this.props.mode].toLowerCase() + " keyboard-set-" + this.state.set + " keyboard-caps-" + this.state.caps}>
                    {set.map((row, rowIndex) => <div key={rowIndex.toString()} className="keyboard-row">{row.map((char, charIndex) => <Key key={charIndex.toString()} onPress={() => this.clickChar(char)} rowIndex={rowIndex} charIndex={charIndex}>{this.getChar(char)}</Key>)}</div>)}
                </div>
            </div>
        </div>;
    }
}
