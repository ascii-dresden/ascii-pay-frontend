import { useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AsciiPayAuthenticationClient,
  WebSocketMessageHandler,
  WebSocketResponse,
} from '../ascii-pay-authentication-client';
import Keypad from '../components/Keypad';
import Money, { moneyToString } from '../components/Money';
import Sidebar, { SidebarAction } from '../components/SidebarPage';
import { useAppDispatch, useAppSelector } from '../store';
import Basket from './Basket';
import PaymentDialog from './PaymentDialog';
import './PaymentPage.scss';
import {
  cancelPayment,
  payment,
  receiveAccountAccessToken,
  removeAccount,
  setKeypadValue,
  setScreensaver,
  submitKeypadValue,
} from './paymentSlice';
import ProductList from './ProductList';
import ScannedAccount from './ScannedAccount';

export default function PaymentPage(props: { authClient: AsciiPayAuthenticationClient }) {
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const keypadValue = useAppSelector((state) => state.payment.keypadValue);
  const storedKeypadValues = useAppSelector((state) => state.payment.storedKeypadValues);
  const storedProducts = useAppSelector((state) => state.payment.storedProducts);
  const paymentPayment = useAppSelector((state) => state.payment.payment);
  const dispatch = useAppDispatch();
  const client = useApolloClient();

  const [showProductList, setShowProductList] = useState(false);
  const basketSum =
    storedKeypadValues.reduce((previous, current) => previous + current, 0) +
    storedProducts.reduce((previous, current) => previous + current.product.currentPrice * current.amount, 0);
  const quickActions: SidebarAction[] = [150, 110, 100, 80, -10, -100].map((v) => {
    return {
      title: 'Quick link: ' + moneyToString(v),
      element: <Money value={v} compact={true} />,
      action: () => dispatch(submitKeypadValue(v)),
      bottom: v < 0,
    };
  });

  const payAction = () => {
    if (keypadValue !== 0) {
      dispatch(submitKeypadValue(keypadValue));
    }

    dispatch(payment());
    props.authClient.requestAccountAccessToken();
  };

  const handler: WebSocketMessageHandler = {
    onMessage(_message: WebSocketResponse) {
      dispatch(setScreensaver(false));
    },
    onFoundAccountAccessToken(accessToken: string) {
      dispatch(
        receiveAccountAccessToken({
          apollo: client,
          accessToken: accessToken,
        })
      );
    },
    onNfcCardRemoved() {
      dispatch(removeAccount());
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);
  React.useEffect(() => {
    props.authClient.requestAccountAccessToken();
  }, [props.authClient]);

  return (
    <Sidebar defaultAction={handleGoBack} content={quickActions}>
      <div className="payment-page-left">
        <ScannedAccount />
        <Basket />
        <div className="payment-page-basket-sum">
          <Money value={basketSum} />
          <span onClick={payAction}>Pay</span>
        </div>
      </div>
      <div className="payment-page-right">
        {showProductList ? (
          <ProductList />
        ) : (
          <Keypad
            value={keypadValue}
            onChange={(value) => dispatch(setKeypadValue(value))}
            onSubmit={(value) => {
              dispatch(submitKeypadValue(value));
            }}
          />
        )}
      </div>
      <div className="payment-page-tabs">
        <span className={!showProductList ? 'active' : ''} onClick={() => setShowProductList(false)}>
          Keypad
        </span>
        <span className={showProductList ? 'active' : ''} onClick={() => setShowProductList(true)}>
          Products
        </span>
      </div>
      {paymentPayment ? <PaymentDialog payment={paymentPayment} onClose={() => dispatch(cancelPayment())} /> : <></>}
    </Sidebar>
  );
}
