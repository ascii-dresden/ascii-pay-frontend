import React from 'react';
import { useHistory } from 'react-router-dom';
import Keypad from '../components/Keypad';
import Money, { moneyToString } from '../Money';
import Sidebar, { SidebarAction } from '../SidebarPage';
import { useAppDispatch, useAppSelector } from '../store';
import Basket from './Basket';
import './PaymentPage.scss';
import { setKeypadValue, submitKeypadValue } from './paymentSlice';
import ScannedAccount from './ScannedAccount';

export default function PaymentPage() {
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const keypadValue = useAppSelector((state) => state.payment.keypadValue);
  const storedKeypadValues = useAppSelector((state) => state.payment.storedKeypadValues);
  const dispatch = useAppDispatch();

  const basketSum = storedKeypadValues.reduce((previous, current) => previous + current, 0);

  const quickActions: SidebarAction[] = [150, 110, 100, 80, -10, -100].map((v) => {
    return {
      title: 'Schnelllink: ' + moneyToString(v),
      element: <Money value={v} compact={true} />,
      action: () => dispatch(submitKeypadValue(v)),
      buttom: v < 0,
    };
  });

  return (
    <Sidebar defaultAction={handleGoBack} content={quickActions}>
      <div className="payment-page-left">
        <ScannedAccount />
        <Basket />
        <div className="payment-page-basket-sum">
          <Money value={basketSum} />
          <span>Pay</span>
        </div>
      </div>
      <div className="payment-page-right">
        <Keypad
          value={keypadValue}
          onChange={(value) => dispatch(setKeypadValue(value))}
          onSubmit={(value) => {
            dispatch(setKeypadValue(value));
          }}
        />
      </div>
    </Sidebar>
  );
}
