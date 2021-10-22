import React from 'react';
import { MdEuroSymbol, MdPhoto } from 'react-icons/md';
import Money from '../components/Money';
import Stamp from '../components/Stamp';
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
      stamps.push(<Stamp key="coffee-10" value={-10} type={StampType.COFFEE} />);
    } else if (value.payWithStamps === StampType.BOTTLE) {
      stamps.push(<Stamp key="bottle-10" value={-10} type={StampType.BOTTLE} />);
    }

    if (value.giveStamps === StampType.COFFEE) {
      stamps.push(<Stamp key="coffee+1" value={1} type={StampType.COFFEE} />);
    } else if (value.giveStamps === StampType.BOTTLE) {
      stamps.push(<Stamp key="bottle+1" value={1} type={StampType.BOTTLE} />);
    }

    let colorClass = value.colorHint ? ' ' + value.colorHint : '';

    return (
      <div key={i} onClick={() => dispatch(removePaymentItemAtIndex(i))}>
        <div className="basket-entry">
          <div className={'basket-entry-image' + colorClass}>
            <div>{image}</div>
          </div>
          <div className="basket-entry-content">
            <div>{value.product?.name ?? value.nameHint}</div>
            <div className="basket-entry-stamps">{stamps}</div>
          </div>
          <div className="basket-entry-price">
            <Money value={value.price} />
          </div>
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
