import { useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import { MdApps, MdManageSearch, MdOutlineCalculate, MdSchedule } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import {
  AsciiPayAuthenticationClient,
  WebSocketMessageHandler,
  WebSocketResponse,
} from '../ascii-pay-authentication-client';
import Keypad from '../components/Keypad';
import Money from '../components/Money';
import Sidebar, { SidebarAction } from '../components/SidebarPage';
import Stamp from '../components/Stamp';
import { useAppDispatch, useAppSelector } from '../store';
import { StampType } from '../types/graphql-global';
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
import QuickAccess from './QuickAccess';
import ScannedAccount from './ScannedAccount';

enum Page {
  QUICK,
  KEYPAD,
  PRODUCTS,
}

export default function PaymentPage(props: { authClient: AsciiPayAuthenticationClient }) {
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const keypadValue = useAppSelector((state) => state.payment.keypadValue);
  const paymentTotal = useAppSelector((state) => state.payment.paymentTotal);
  const paymentCoffeeStamps = useAppSelector((state) => state.payment.paymentCoffeeStamps);
  const paymentBottleStamps = useAppSelector((state) => state.payment.paymentBottleStamps);
  const storedPaymentItems = useAppSelector((state) => state.payment.storedPaymentItems);
  const paymentPayment = useAppSelector((state) => state.payment.payment);
  const dispatch = useAppDispatch();
  const client = useApolloClient();

  const [activePage, setActivePage] = useState(Page.QUICK);
  const quickActions: SidebarAction[] = [
    {
      title: 'Quick access',
      element: <MdApps />,
      action: () => setActivePage(Page.QUICK),
      active: activePage === Page.QUICK,
    },
    {
      title: 'Keypad',
      element: <MdOutlineCalculate />,
      action: () => setActivePage(Page.KEYPAD),
      active: activePage === Page.KEYPAD,
    },
    {
      title: 'Product list',
      element: <MdManageSearch />,
      action: () => setActivePage(Page.PRODUCTS),
      active: activePage === Page.PRODUCTS,
    },
    {
      title: 'Enable screensaver',
      element: <MdSchedule />,
      action: (event) => {
        event.stopPropagation();
        dispatch(setScreensaver(true));
      },
      bottom: true,
    },
  ];

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
      return true;
    },
    onNfcCardRemoved() {
      dispatch(removeAccount());
      return true;
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

  let content;
  switch (activePage) {
    case Page.QUICK:
      content = <QuickAccess />;
      break;
    case Page.KEYPAD:
      content = (
        <Keypad
          value={keypadValue}
          onChange={(value) => dispatch(setKeypadValue(value))}
          onSubmit={(value) => {
            dispatch(submitKeypadValue(value));
          }}
        />
      );
      break;
    case Page.PRODUCTS:
      content = <ProductList />;
      break;
  }

  return (
    <Sidebar defaultAction={handleGoBack} content={quickActions}>
      <div className="payment-page-left">{content}</div>
      <div className="payment-page-right">
        <ScannedAccount />
        <Basket />
        <div className="payment-page-summary">
          <Money value={paymentTotal} />
          <Stamp value={paymentCoffeeStamps} type={StampType.COFFEE} />
          <Stamp value={paymentBottleStamps} type={StampType.BOTTLE} />
          <span
            onClick={payAction}
            className={storedPaymentItems.length > 0 || keypadValue !== 0 ? 'enabled' : 'disabled'}
          >
            Pay
          </span>
        </div>
      </div>
      {paymentPayment ? <PaymentDialog payment={paymentPayment} onClose={() => dispatch(cancelPayment())} /> : <></>}
    </Sidebar>
  );
}
