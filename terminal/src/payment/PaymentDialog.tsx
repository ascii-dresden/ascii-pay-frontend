import React, { useState } from 'react';

import './PaymentDialog.scss';
import { MdDone, MdErrorOutline, MdHourglassEmpty } from 'react-icons/md';
import { SiContactlesspayment } from 'react-icons/si';
import Dialog from '../components/Dialog';
import Money from '../components/Money';
import { PaymentStatus } from './paymentSlice';

export default function PaymentDialog(props: { amount: number; status: PaymentStatus; onClose: () => void }) {
  const [lastChangeTime, setLastChangeTime] = useState(Date.now());

  const checkTimeout = () => {
    if (props.status !== PaymentStatus.Waiting) {
      let t = 5000;
      if (props.status === PaymentStatus.Success) {
        t = 2000;
      }

      if (lastChangeTime + t > Date.now()) {
        props.onClose();
      }
    }
  };

  React.useEffect(() => {
    const handler = setInterval(checkTimeout, 1000);
    return () => {
      clearInterval(handler);
    };
  });

  React.useEffect(() => {
    setLastChangeTime(Date.now());
  }, [props.status]);

  let status;
  var message = '';
  switch (props.status as PaymentStatus) {
    case PaymentStatus.Success:
      status = (
        <div className="payment-status payment-success">
          <MdDone />
        </div>
      );
      break;
    case PaymentStatus.Timeout:
      status = (
        <div className="payment-status payment-warn">
          <MdHourglassEmpty />
        </div>
      );
      message = 'Timeout';
      break;
    case PaymentStatus.AuthenticationError:
      status = (
        <div className="payment-status payment-error">
          <MdErrorOutline />
        </div>
      );
      message = 'Authentication error';
      break;
    case PaymentStatus.PaymentError:
      status = (
        <div className="payment-status payment-error">
          <MdErrorOutline />
        </div>
      );
      message = 'Payment error';
      break;
    default:
      status = (
        <div className="payment-status">
          <SiContactlesspayment />
        </div>
      );
      break;
  }

  let actionList = [
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
        <Money value={props.amount} />
      </div>
    </Dialog>
  );
}
