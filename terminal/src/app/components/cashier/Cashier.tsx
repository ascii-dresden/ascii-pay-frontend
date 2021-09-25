import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './Cashier.scss';

import { Account, Product } from '@ascii-pay-frontend/common/src/models';
import {
  registerEventHandler,
  EventHandler,
  removeEventHandler,
  requestPaymentToken,
  cancelTokenRequest,
} from '@ascii-pay-frontend/common/src/api';
import { payment } from '@ascii-pay-frontend/common/src/api';

import { Basket, BasketData } from './Basket';
import { Customer } from './Customer';
import { Keypad } from '../Keypad';
import { Payment, PaymentStatus, PaymentData } from './Payment';
import { ProductList } from './ProductList';

export interface CashierProps {}
export interface CashierState {
  account: Account | null;
  basketProducts: BasketData[];
  basketFreehands: number[];
  freehand: number;
  payment: PaymentData | null;
}

export class Cashier extends React.Component<CashierProps, CashierState> implements EventHandler {
  static displayName = 'Cashier';

  constructor(props: Cashier) {
    super(props);

    this.state = {
      account: null,
      basketProducts: [],
      basketFreehands: [],
      freehand: 0,
      payment: null,
    };
  }

  removeAccount() {
    this.setState({
      account: null,
    });
  }

  updateProduct(product: Product, diff: number) {
    this.setState((state) => {
      var found = false;
      var newBasket = state.basketProducts
        .map((data) => {
          if (data.product.id === product.id) {
            found = true;
            if (data.amount + diff <= 0) {
              return null;
            } else
              return {
                product: data.product,
                amount: data.amount + diff,
              };
          } else return data;
        })
        .filter((data) => {
          return data !== null;
        }) as BasketData[];

      if (!found && diff > 0) {
        newBasket.push({
          product,
          amount: diff,
        });
      }

      return {
        basketProducts: newBasket,
      };
    });
  }

  removeFreehand(index: number) {
    this.setState((state, props) => {
      let list = state.basketFreehands.map((f) => f);
      list.splice(index, 1);
      return {
        basketFreehands: list,
      };
    });
  }

  setFreehand(freehand: number) {
    this.setState({
      freehand: freehand,
    });
  }

  submitFreehand() {
    this.setState((state, props) => {
      let freehand = state.freehand;
      if (freehand === 0) return;
      let list = state.basketFreehands.map((f) => f);
      list.push(freehand);
      return {
        basketFreehands: list,
      };
    });
  }

  pay() {
    this.setState((state, props) => {
      let basketFreehands = state.basketFreehands.map((f) => f);
      if (state.freehand != 0) {
        basketFreehands.push(state.freehand);
      }

      var amount = 0;
      for (var i = 0; i < basketFreehands.length; i++) {
        amount += basketFreehands[i];
      }
      for (let data of state.basketProducts) {
        amount += (data.product.current_price || 0) * data.amount;
      }

      if (state.payment === null && amount != 0) {
        (async () => {
          await requestPaymentToken(-amount);
        })();

        return {
          basketFreehands: basketFreehands,
          payment: {
            status: PaymentStatus.Waiting,
            amount: amount,
          },
        };
      } else {
        return {
          basketFreehands: basketFreehands,
          payment: null,
        };
      }
    });
  }

  cancelPayment() {
    this.setState({
      payment: null,
    });
    (async () => {
      await cancelTokenRequest();
    })();
  }

  render() {
    var payment = null;
    if (this.state.payment !== null) {
      payment = <Payment data={this.state.payment} close={() => this.cancelPayment()} />;
    }

    return (
      <div id="cashier">
        {payment}
        <div id="cashier-left">
          <Customer account={this.state.account} removeAccount={() => this.removeAccount()} />
          <Basket
            products={this.state.basketProducts}
            freehand={this.state.basketFreehands}
            updateProduct={(product, diff) => this.updateProduct(product, diff)}
            deleteFreehand={(index) => this.removeFreehand(index)}
            pay={() => this.pay()}
          />
        </div>
        <div id="cashier-right">
          <Tabs>
            <TabList>
              <Tab>Keypad</Tab>
              <Tab>Products</Tab>
            </TabList>
            <TabPanel>
              <Keypad
                value={this.state.freehand}
                onChange={(value) => this.setFreehand(value)}
                onSubmit={() => this.submitFreehand()}
              />
            </TabPanel>
            <TabPanel>
              <ProductList selectProduct={(product) => this.updateProduct(product, 1)} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }

  onAccountScanned(account: Account) {
    this.setState({
      account,
    });
  }

  onProductScanned(product: Product) {
    if (this.state.payment === null) {
      this.updateProduct(product, 1);
    }
  }

  onPaymentTokenGenerated(token: string) {
    let p = this.state.payment;
    if (p !== null) {
      let products = new Map();
      for (let entry of this.state.basketProducts) {
        products.set(entry.product, entry.amount);
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
                amount: this.state.payment?.amount || 0,
              },
            });
          } else {
            this.setState({
              payment: {
                status: PaymentStatus.PaymentError,
                amount: this.state.payment?.amount || 0,
              },
            });
          }
        } catch (e) {
          this.setState({
            payment: {
              status: PaymentStatus.PaymentError,
              amount: this.state.payment?.amount || 0,
            },
          });
        }
      })();
    }
  }

  onTimeout() {
    this.removeAccount();
    if (this.state.payment !== null) {
      this.setState({
        payment: {
          status: PaymentStatus.Timeout,
          amount: this.state.payment.amount,
        },
      });
    }
  }

  onBarCodeScanned(code: string) {
    console.log('Bar code', code);
  }

  onNfcCardAdded(id: string, writeable: boolean) {
    this.removeAccount();
  }

  onNfcCardRemoved() {
    this.removeAccount();
  }

  componentDidMount() {
    registerEventHandler(this);
  }

  componentWillUnmount() {
    removeEventHandler(this);
  }
}
