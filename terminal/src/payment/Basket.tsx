import React from 'react';
import { MdCoffee, MdEuroSymbol, MdLiquor, MdPhoto } from 'react-icons/md';
import Money from '../components/Money';
import { useAppDispatch, useAppSelector } from '../store';
import { StampType } from '../types/graphql-global';
import './Basket.scss';
import { removePaymentItemAtIndex } from './paymentSlice';

export default function Basket() {
  const storedPaymentItems = useAppSelector((state) => state.payment.storedPaymentItems);
  const dispatch = useAppDispatch();

  if (storedPaymentItems.length <= 0) {
    return <div className="basket-empty">No entries!</div>;
  }

  const content = storedPaymentItems.map((value, i) => {
    let image;

    if (value.product) {
      if (value.product.image) {
        image = (
          <div>
            <img src={value.product.image} alt="" />
          </div>
        );
      } else {
        image = (
          <div>
            <MdPhoto />
          </div>
        );
      }
    } else {
      image = (
        <div>
          <MdEuroSymbol />
        </div>
      );
    }

    let stamps: any[] = [];
    if (value.payWithStamps === StampType.COFFEE) {
      stamps.push(
        <div key="coffee-10">
          <MdCoffee />
          <span>-10</span>
        </div>
      );
    } else if (value.payWithStamps === StampType.BOTTLE) {
      stamps.push(
        <div key="bottle-10">
          <MdLiquor />
          <span>-10</span>
        </div>
      );
    }

    if (value.giveStamps === StampType.COFFEE) {
      stamps.push(
        <div key="coffee+1">
          <MdCoffee />
          <span>+1</span>
        </div>
      );
    } else if (value.giveStamps === StampType.BOTTLE) {
      stamps.push(
        <div key="bottle+1">
          <MdLiquor />
          <span>+1</span>
        </div>
      );
    }

    return (
      <div key={i} onClick={() => dispatch(removePaymentItemAtIndex(i))}>
        <div className="basket-entry">
          <div className="basket-entry-image">
            <div>{image}</div>
          </div>
          <div className="basket-entry-name">{value.product?.name}</div>
          <div className="basket-entry-price">
            <Money value={value.price} />
          </div>
          <div className="basket-entry-stamps">{stamps}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="basket">
      <div>{content}</div>
    </div>
  );
}
