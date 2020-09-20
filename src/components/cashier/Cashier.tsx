import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./Cashier.scss";

import { Account, Product } from "../../app/core/models";
import { registerEventHandler, EventHandler, removeEventHandler } from "../../app/core/api";

import { Barista } from "./Barista";
import { Basket, BasketData } from "./Basket";
import { Customer } from "./Customer";
import { Keypad } from "./Keypad";
import { ProductList } from "./ProductList";

export interface CashierProps { }
export interface CashierState {
    account: Account,
    basketProducts: BasketData[],
    basketFreehands: number[],
 }

export class Cashier extends React.Component<CashierProps, CashierState> implements EventHandler {
    static displayName = "Cashier"

    constructor(props: Cashier) {
        super(props)

        this.state = {
            account: null,
            basketProducts: [],
            basketFreehands: []
        }
    }

    removeAccount() {
        this.setState({
            account: null
        });
    }

    updateProduct(product: Product, diff: number) {
        this.setState((state, props) => {
            var found = false;
            var newBasket = state.basketProducts.map((data) => {
                if (data.product.id === product.id) {
                    found = true
                    if (data.amount + diff <= 0) {
                        return null
                    } else return {
                        product: data.product,
                        amount: data.amount + diff
                    }
                } else return data
            }).filter((data) => {
                return data != null
            })

            if (!found && diff > 0) {
                newBasket.push({
                    product,
                    amount: diff
                })
            }

            return {
                basketProducts: newBasket
            }
        });
    }

    removeFreehand(index: number) {
        this.setState((state, props) => {
            let list = state.basketFreehands.map((f) => f);
            list.splice(index, 1)
            return {
                basketFreehands: list
            }
        })
    }

    addFreehand(freehand: number) {
        if (freehand === 0) return;

        this.setState((state, props) => {
            let list = state.basketFreehands.map((f) => f);
            list.push(freehand);
            return {
                basketFreehands: list
            }
        })
    }

    render() {
        return <div id="cashier">
            <div id="cashier-left">
                <Barista />
                <Customer account={this.state.account} removeAccount={() => this.removeAccount()} />
                <Basket
                    products={this.state.basketProducts}
                    freehand={this.state.basketFreehands}
                    updateProduct={(product, diff) => this.updateProduct(product, diff)}
                    deleteFreehand={(index) => this.removeFreehand(index)} />
            </div>
            <div id="cashier-right">
                <Tabs>
                    <TabList>
                        <Tab>Keypad</Tab>
                        <Tab>Products</Tab>
                    </TabList>
                    <TabPanel>
                        <Keypad onSubmit={(cents: number) => this.addFreehand(cents)} />
                    </TabPanel>
                    <TabPanel>
                        <ProductList selectProduct={(product) => this.updateProduct(product, 1)} />
                    </TabPanel>
                </Tabs>
            </div>
        </div>;
    }

    onAccountScanned(account: Account) {
        this.setState({
            account
        });
    }

    onProductScanned(product: Product) {
        this.updateProduct(product, 1)
    }

    componentDidMount() {
        registerEventHandler(this);
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }
}
