import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./Cashier.scss";

import { Barista } from "./Barista";
import { Customer } from "./Customer";
import { Keypad } from "./Keypad";
import { ProductList } from "./ProductList";

export interface CashierProps { }
export interface CashierState { }

export class Cashier extends React.Component<CashierProps, CashierState> {
    static displayName = "Cashier"

    render() {
        return <div id="cashier">
            <div id="cashier-left">
                <Barista />
                <Customer />
            </div>
            <div id="cashier-right">
                <Tabs>
                    <TabList>
                        <Tab>Keypad</Tab>
                        <Tab>Products</Tab>
                    </TabList>
                    <TabPanel>
                        <Keypad onSubmit={(cents: number) => console.log(cents)} />
                    </TabPanel>
                    <TabPanel>
                        <ProductList />
                    </TabPanel>
                </Tabs>
            </div>
        </div>;
    }
}
