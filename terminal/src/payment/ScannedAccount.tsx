import React from 'react';
import { MdCancel, MdCoffee, MdLiquor, MdPayment } from 'react-icons/md';
import Money from '../components/Money';
import { useAppDispatch, useAppSelector } from '../store';
import { removeAccount } from './paymentSlice';
import './ScannedAccount.scss';

export default function ScannedAccount() {
  const scannedAccount = useAppSelector((state) => state.payment.scannedAccount);
  const dispatch = useAppDispatch();

  if (scannedAccount === null) {
    return <div className="scanned-account">No account scanned!</div>;
  }

  return (
    <div className="scanned-account" onClick={() => dispatch(removeAccount())}>
      <div className="scanned-account-name">{scannedAccount.name}</div>
      <div className="scanned-account-tags">
        <div>
          <MdPayment />
          <Money value={scannedAccount.credit} />
        </div>
        <div>
          <MdCoffee />
          <span>{scannedAccount.coffeeStamps}</span>
        </div>
        <div>
          <MdLiquor />
          <span>{scannedAccount.bottleStamps}</span>
        </div>
      </div>
      <div className="scanned-account-remove">
        <MdCancel />
      </div>
    </div>
  );
}
