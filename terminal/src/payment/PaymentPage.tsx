import { useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AsciiPayAuthenticationClient, WebSocketMessageHandler } from '../ascii-pay-authentication-client';
import Keypad from '../components/Keypad';
import Money, { moneyToString } from '../components/Money';
import Sidebar, { SidebarAction } from '../components/SidebarPage';
import { GET_ACCOUNT_BY_ACCESS_TOKEN, TRANSACTION } from '../graphql';
import { useAppDispatch, useAppSelector } from '../store';
import { getAccountByAccessToken, getAccountByAccessTokenVariables } from '../__generated__/getAccountByAccessToken';
import { transaction, transactionVariables } from '../__generated__/transaction';
import Basket from './Basket';
import PaymentDialog from './PaymentDialog';
import './PaymentPage.scss';
import {
  clearKeypadValue,
  PaymentStatus,
  removeAccount,
  removePaymentDialog,
  setAccount,
  setKeypadValue,
  setPaymentDialog,
  submitKeypadValue,
  updatePaymentDialog,
} from './paymentSlice';
import ScannedAccount from './ScannedAccount';

export default function PaymentPage(props: { authClient: AsciiPayAuthenticationClient }) {
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const keypadValue = useAppSelector((state) => state.payment.keypadValue);
  const storedKeypadValues = useAppSelector((state) => state.payment.storedKeypadValues);
  const paymentDialogStatus = useAppSelector((state) => state.payment.payment);
  const dispatch = useAppDispatch();

  const client = useApolloClient();

  const [showProductList, setShowProductList] = useState(false);

  const basketSum = storedKeypadValues.reduce((previous, current) => previous + current, 0);

  const quickActions: SidebarAction[] = [150, 110, 100, 80, -10, -100].map((v) => {
    return {
      title: 'Schnelllink: ' + moneyToString(v),
      element: <Money value={v} compact={true} />,
      action: () => dispatch(submitKeypadValue(v)),
      buttom: v < 0,
    };
  });

  const payAction = () => {
    if (keypadValue !== 0) {
      dispatch(submitKeypadValue(keypadValue));
    }

    props.authClient.requestAccountAccessToken();
    dispatch(setPaymentDialog(PaymentStatus.Waiting));
  };

  const handler: WebSocketMessageHandler = (message) => {
    if (message.type === 'FoundAccountAccessToken') {
      if (paymentDialogStatus) {
        (async () => {
          let result = await client.mutate<transaction, transactionVariables>({
            mutation: TRANSACTION,
            variables: {
              accountAccessToken: message.payload.access_token,
              amount: paymentDialogStatus.amount,
            },
          });

          if (result.errors || !result.data) {
            dispatch(updatePaymentDialog(PaymentStatus.PaymentError));
          } else {
            let data = result.data;
            dispatch(clearKeypadValue());
            dispatch(updatePaymentDialog(PaymentStatus.Success));
            dispatch(
              setAccount({
                id: data?.transaction.account.id,
                name: data.transaction.account.name,
                balance: data.transaction.account.credit,
              })
            );
          }
        })();
      } else {
        (async () => {
          let result = await client.query<getAccountByAccessToken, getAccountByAccessTokenVariables>({
            query: GET_ACCOUNT_BY_ACCESS_TOKEN,
            variables: {
              accountAccessToken: message.payload.access_token,
            },
          });
          let data = result.data;
          dispatch(
            setAccount({
              id: data.getAccountByAccessToken.id,
              name: data.getAccountByAccessToken.name,
              balance: data.getAccountByAccessToken.credit,
            })
          );
        })();
      }
    } else if (message.type === 'NfcCardRemoved') {
      dispatch(removeAccount());
    }
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
  });
  React.useEffect(() => {
    props.authClient.requestAccountAccessToken();
  }, []);

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
          <div></div>
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
      {paymentDialogStatus ? (
        <PaymentDialog
          amount={paymentDialogStatus.amount}
          status={paymentDialogStatus.status}
          onClose={() => dispatch(removePaymentDialog())}
        />
      ) : (
        <></>
      )}
    </Sidebar>
  );
}
