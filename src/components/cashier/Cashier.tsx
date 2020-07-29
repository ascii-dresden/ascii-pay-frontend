import * as React from "react";

import "./Cashier.scss";

import Barista from "./Barista";
import Customer from "./Customer";
import Keypad from "./Keypad";

export interface CashierProps {  }
export interface CashierState {  }

export default class Cashier extends React.Component<CashierProps, CashierState> {

    render() {
        return <div id="cashier">
            <div id="cashier-left">
                <Barista />
                <Customer />
            </div>
            <div id="cashier-right">
                <Keypad onSubmit={(cents: number) => console.log(cents)} />
            </div>
        </div>;
    }
}
