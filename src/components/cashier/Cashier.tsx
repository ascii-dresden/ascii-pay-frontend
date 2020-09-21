import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./Cashier.scss";

import { Account, Product } from "../../app/core/models";
import { registerEventHandler, EventHandler, removeEventHandler, requestPaymentToken, cancelTokenRequest } from "../../app/core/api";
import { payment } from "../../app/core/api"

import { Barista } from "./Barista";
import { Basket, BasketData } from "./Basket";
import { Customer } from "./Customer";
import { Keypad } from "./Keypad";
import { Payment, PaymentStatus, PaymentData } from "./Payment";
import { ProductList } from "./ProductList";

export interface CashierProps { }
export interface CashierState {
    account: Account,
    basketProducts: BasketData[],
    basketFreehands: number[],
    payment: PaymentData
 }

export class Cashier extends React.Component<CashierProps, CashierState> implements EventHandler {
    static displayName = "Cashier"

    constructor(props: Cashier) {
        super(props)

        this.state = {
            account: null,
            basketProducts: [],
            basketFreehands: [],
            payment: null
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

    pay(amount: number) {
        if (this.state.payment === null && amount != 0) {
            this.setState({
                payment: {
                    status: PaymentStatus.Waiting,
                    amount: amount
                }
            });

            (async () => {
                await requestPaymentToken(-amount);
            })()
        }
    }

    cancelPayment() {
        this.setState({
            payment: null
        });
        (async () => {
            await cancelTokenRequest();
        })();
    }

    render() {
        var payment = null;
        if (this.state.payment !== null) {
            payment = <Payment data={this.state.payment} close={() => this.cancelPayment()} />
        }

        return <div id="cashier">
            {payment}
            <div id="cashier-left">
                <Barista />
                <Customer account={this.state.account} removeAccount={() => this.removeAccount()} />
                <Basket
                    products={this.state.basketProducts}
                    freehand={this.state.basketFreehands}
                    updateProduct={(product, diff) => this.updateProduct(product, diff)}
                    deleteFreehand={(index) => this.removeFreehand(index)}
                    pay={(amount) => this.pay(amount)} />
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
        if (this.state.payment === null) {
            this.updateProduct(product, 1)
        }
    }

    onPaymentTokenGenerated(token: string) {
        let p = this.state.payment;
        if (p !== null) {
            let products = new Map();
            for (let entry of this.state.basketProducts) {
                products.set(entry.product, entry.amount)
            }
            (async () => {
                try {
                    let response = await payment(-p.amount, token, products);
                    if (response && response.account) {
                        this.setState({
                            account: response.account,
                            basketProducts: [],
                            basketFreehands: [],
                            payment: {
                                status: PaymentStatus.Success,
                                amount: this.state.payment.amount
                            }
                        });
                    } else {
                        this.setState({
                            payment: {
                                status: PaymentStatus.PaymentError,
                                amount: this.state.payment.amount
                            }
                        });
                    }
                } catch(e) {
                    this.setState({
                        payment: {
                            status: PaymentStatus.PaymentError,
                            amount: this.state.payment.amount
                        }
                    });
                }
            })()
        }
    }

    onTimeout() {
        if (this.state.payment !== null) {
            this.setState({
                payment: {
                    status: PaymentStatus.Timeout,
                    amount: this.state.payment.amount
                }
            });
        }
    }
    
    onBarCodeScanned(code: string) {
        console.log("Bar code", code);
    }

    onNfcCardAdded(id: string, writeable: boolean) {
        console.log("Nfc card added", id, writeable);
    }

    onNfcCardRemoved() {
        console.log("Nfc card removed");
    }

    componentDidMount() {
        registerEventHandler(this);
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }
}
