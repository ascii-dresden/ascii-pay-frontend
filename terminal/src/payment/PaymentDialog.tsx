import React from 'react';

import './PaymentDialog.scss';
import { MdClose, MdDone, MdErrorOutline, MdHelpOutline } from 'react-icons/md';
import { SiContactlesspayment } from 'react-icons/si';
import Money from '../components/Money';
import {
  PaymentPayment,
  paymentProceedWithoutStamps,
  paymentProceedWithStamps,
  receiveAccountAccessToken,
} from './paymentSlice';
import Stamp from '../components/Stamp';
import { StampType } from '../types/graphql-global';
import { useAppDispatch } from '../store';
import { useApolloClient } from '@apollo/client';

export default function PaymentDialog(props: { payment: PaymentPayment; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const client = useApolloClient();

  let status;
  let message = '';
  let title = '';

  switch (props.payment.type) {
    case 'Success':
      status = (
        <div className="payment-status payment-success">
          <MdDone />
        </div>
      );
      break;
    case 'ReacalculateStamps':
      status = (
        <div className="payment-status payment-warn">
          <MdHelpOutline />
        </div>
      );
      title = 'Stempel einlösen';
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

  let proceedWithStamps = () => {
    if (props.payment.type === 'ReacalculateStamps') {
      let accessToken = props.payment.accountAccessToken;
      dispatch(paymentProceedWithStamps());

      setTimeout(() => {
        dispatch(
          receiveAccountAccessToken({
            apollo: client,
            accessToken: accessToken,
          })
        );
      }, 500);
    }
  };
  let proceedWithoutStamps = () => {
    if (props.payment.type === 'ReacalculateStamps') {
      let accessToken = props.payment.accountAccessToken;
      dispatch(paymentProceedWithoutStamps());

      setTimeout(() => {
        dispatch(
          receiveAccountAccessToken({
            apollo: client,
            accessToken: accessToken,
          })
        );
      }, 500);
    }
  };

  let leftContent = (
    <div className={'payment-dialog-content' + (props.payment.type === 'ReacalculateStamps' ? ' left' : '')}>
      <div>
        <Money value={props.payment.total} />
      </div>
      <div>
        <Stamp value={props.payment.coffeeStamps} type={StampType.COFFEE} />
        <Stamp value={props.payment.bottleStamps} type={StampType.BOTTLE} />
      </div>
      {props.payment.type === 'ReacalculateStamps' ? (
        <button onClick={proceedWithoutStamps}>Proceed transaction</button>
      ) : null}
    </div>
  );

  let rightContent;
  if (props.payment.type === 'ReacalculateStamps') {
    rightContent = (
      <div className="payment-dialog-content right">
        <div>
          <Money value={props.payment.withStamps.total} />
        </div>
        <div>
          <Stamp value={props.payment.withStamps.coffeeStamps} type={StampType.COFFEE} />
          <Stamp value={props.payment.withStamps.bottleStamps} type={StampType.BOTTLE} />
        </div>
        <button onClick={proceedWithStamps}>Pay with stamps</button>
      </div>
    );
  }
  return (
    <div className="payment-dialog">
      <div className="payment-dialog-background" onClick={props.onClose}></div>
      <div className="payment-dialog-window">
        <div className="payment-dialog-cancel" onClick={props.onClose}>
          <MdClose />
        </div>
        <div className="payment-dialog-title">{title}</div>
        <div className="payment-dialog-status">{status}</div>
        <div className="payment-dialog-message">{message}</div>
        {leftContent}
        {rightContent}
      </div>
    </div>
  );
}
