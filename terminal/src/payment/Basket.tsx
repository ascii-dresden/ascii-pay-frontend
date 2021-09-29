import React from 'react';
import { MdEuroSymbol } from 'react-icons/md';
import Money from '../Money';
import { useAppDispatch, useAppSelector } from '../store';
import './Basket.scss';
import { removeKeypadValue } from './paymentSlice';

export default function Basket() {
  const storedKeypadValues = useAppSelector((state) => state.payment.storedKeypadValues);
  const dispatch = useAppDispatch();

  if (storedKeypadValues.length <= 0) {
    return <div className="basket-empty">No entries</div>;
  }

  const content = storedKeypadValues.map((value, i) => (
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

  return <div className="basket">{content}</div>;
}
