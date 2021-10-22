import React from 'react';
import { MdCancel } from 'react-icons/md';
import Money from '../components/Money';
import Stamp from '../components/Stamp';
import { useAppDispatch, useAppSelector } from '../store';
import { StampType } from '../types/graphql-global';
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
        <Money value={scannedAccount.credit} />
        <Stamp value={scannedAccount.coffeeStamps} type={StampType.COFFEE} />
        <Stamp value={scannedAccount.bottleStamps} type={StampType.BOTTLE} />
      </div>
      <div className="scanned-account-remove">
        <MdCancel />
      </div>
    </div>
  );
}
