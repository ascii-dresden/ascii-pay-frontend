import * as React from "react";

import "./Basket.scss";
import { Product } from "../../app/core/models";
import { MdExpandMore, MdExpandLess, MdPhoto, MdEuroSymbol, MdClear } from "react-icons/md";

export interface BasketProps {
    freehand: number[],
    products: BasketData[],
    deleteFreehand: (index: number) => void,
    updateProduct: (product: Product, diff: number) => void
}
export interface BasketState { }

export interface BasketData {
    product: Product,
    amount: number
}

export class Basket extends React.Component<BasketProps, BasketState> {
    static displayName = "Basket"

    render() {
        let list = [];

        var sum = 0;

        for (var i = 0; i < this.props.freehand.length; i++) {
            let freehand = this.props.freehand[i];
            sum += freehand
            list.push(
                <BasketFreehand key={i} freehand={freehand} index={i} delete={(index) => this.props.deleteFreehand(index)} />
            )
        }

        for (let data of this.props.products) {
            sum += data.product.current_price * data.amount;
            list.push(
                <BasketEntry
                    key={data.product.id}
                    product={data.product}
                    amount={data.amount}
                    updateAmount={(diff) => this.props.updateProduct(data.product, diff)} />
            )
        }

        return <div className="basket">
            <div className="basket-content">{list}</div>
            <div className="basket-footer">
                <div className="basket-footer-sum">{(sum / 100).toFixed(2)}€</div>
            </div>
        </div>;
    }
}


interface BasketEntryProps {
    product: Product,
    amount: number,
    updateAmount: (diff: number) => void
}
interface BasketEntryState { }

class BasketEntry extends React.Component<BasketEntryProps, BasketEntryState> {
    static displayName = "BasketEntry"

    render() {
        let image;
        if (this.props.product.image) {
            image = <img src={this.props.product.image} />;
        } else {
            image = <div><MdPhoto /></div>;
        }

        let lessIcon = this.props.amount <= 1 ? <MdClear /> : <MdExpandMore />

        return <div className="basket-entry">
            <div className="basket-entry-image"><div>{image}</div></div>
            <div className="basket-entry-name">{this.props.product.name}</div>
            <div className="basket-entry-price">{(this.props.amount * this.props.product.current_price / 100).toFixed(2)}€</div>
            <div className="basket-entry-amount">Amount: {this.props.amount}</div>
            <div className="basket-entry-amount-increase" onClick={() => this.props.updateAmount(1)}><MdExpandLess /></div>
            <div className="basket-entry-amount-decrease" onClick={() => this.props.updateAmount(-1)}>{lessIcon}</div>
        </div>;
    }
}

interface BasketFreehandProps {
    freehand: number,
    index: number,
    delete: (index: number) => void
}
interface BasketFreehandState { }

class BasketFreehand extends React.Component<BasketFreehandProps, BasketFreehandState> {
    static displayName = "BasketFreehand"

    render() {
        return <div className="basket-entry">
            <div className="basket-entry-image"><div><div><MdEuroSymbol /></div></div></div>
            <div className="basket-entry-name">Freehand</div>
            <div className="basket-entry-price">{(this.props.freehand / 100).toFixed(2)}€</div>
            <div className="basket-entry-amount">Lorem ipsum</div>
            <div className="basket-entry-delete" onClick={() => this.props.delete(this.props.index)}><MdClear /></div>
        </div>;
    }
}
