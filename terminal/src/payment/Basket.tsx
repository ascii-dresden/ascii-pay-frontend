import React from 'react';
import { MdEuroSymbol, MdPhoto } from 'react-icons/md';
import Money from '../components/Money';
import { useAppDispatch, useAppSelector } from '../store';
import './Basket.scss';
import { removeKeypadValue, removeProduct } from './paymentSlice';

export default function Basket() {
  const storedKeypadValues = useAppSelector((state) => state.payment.storedKeypadValues);
  const storedProducts = useAppSelector((state) => state.payment.storedProducts);
  const dispatch = useAppDispatch();

  if (storedKeypadValues.length + storedProducts.length <= 0) {
    return <div className="basket-empty">No entries!</div>;
  }

  const contentProducts = storedProducts.map((value, i) => (
    <div key={i} onClick={() => dispatch(removeProduct(value.product.id))}>
      <div className="basket-entry">
        <div className="basket-entry-image">
          <div>
            {value.product.image ? (
              <div>
                <img src={value.product.image} alt="" />
              </div>
            ) : (
              <div>
                <MdPhoto />
              </div>
            )}
          </div>
        </div>
        <div className="basket-entry-name">{value.product.name}</div>
        <div className="basket-entry-price">
          <Money value={value.product.currentPrice} />
        </div>
        <div className="basket-entry-amount">{value.amount}</div>
      </div>
    </div>
  ));
  const contentKeypadValues = storedKeypadValues.map((value, i) => (
    <div key={i} onClick={() => dispatch(removeKeypadValue(value))}>
      <div className="basket-entry">
        <div className="basket-entry-image">
          <div>
            <div>
              <MdEuroSymbol />
            </div>
          </div>
        </div>
        <div className="basket-entry-name"></div>
        <div className="basket-entry-price">
          <Money value={value} />
        </div>
        <div className="basket-entry-amount"></div>
      </div>
    </div>
  ));

  return (
    <div className="basket">
      <div>{contentKeypadValues}</div>
      <div>{contentProducts}</div>
    </div>
  );
}
