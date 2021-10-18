import React from 'react';

import './PaymentDialog.scss';
import { MdDone, MdErrorOutline } from 'react-icons/md';
import { SiContactlesspayment } from 'react-icons/si';
import Dialog from '../components/Dialog';
import Money from '../components/Money';
import { PaymentPayment } from './paymentSlice';

export default function PaymentDialog(props: { payment: PaymentPayment; onClose: () => void }) {
  let status;
  var message = '';
  switch (props.payment.type) {
    case 'Success':
      status = (
        <div className="payment-status payment-success">
          <MdDone />
        </div>
      );
      break;
    case 'Error':
      status = (
        <div className="payment-status payment-error">
          <MdErrorOutline />
        </div>
      );
      message = props.payment.message;
      break;
    default:
      status = (
        <div className="payment-status">
          <SiContactlesspayment />
        </div>
      );
      break;
  }

  const actionList = [
    {
      label: 'Cancel',
      action: () => props.onClose(),
    },
  ];

  return (
    <Dialog title="Payment" actions={actionList}>
      {status}
      <div className="payment-message">{message}</div>
      <div className="payment-amount">
        <Money value={props.payment.total} />
        <span>{props.payment.bottleStamps}</span>
        <span>{props.payment.coffeeStamps}</span>
      </div>
    </Dialog>
  );
}
