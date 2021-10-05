import React from 'react';
import { MdCancel } from 'react-icons/md';
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
      <div>
        <span>{scannedAccount.name}</span>
        <Money value={scannedAccount.credit} />
      </div>
      <MdCancel />
    </div>
  );
}
