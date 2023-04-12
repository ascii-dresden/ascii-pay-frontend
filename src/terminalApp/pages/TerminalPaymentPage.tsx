import React, { useState } from "react";
import Stamp from "../components/Stamp";
import { useTranslation } from "react-i18next";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import { SidebarAction, SidebarLayout } from "../components/SidebarLayout";
import { Apps, CalculateOutlined, ManageSearch } from "@mui/icons-material";
import { ClockIcon } from "../components/ClockIcon";
import { setScreensaver } from "../redux/features/terminalSlice";
import {
  cancelPayment,
  payment,
  receiveAccountSessionToken,
  receiveKeyEvent,
  removeAccount,
  setKeypadValue,
  submitKeypadValue,
} from "../redux/features/paymentSlice";
import { QuickAccess } from "../payment/QuickAccess";
import { ScannedAccount } from "../payment/ScannedAccount";
import { Basket } from "../payment/Basket";
import { Money } from "../components/Money";
import { Keypad } from "../payment/Keypad";
import styled from "@emotion/styled";
import { ProductList } from "../payment/ProductList";
import {
  ReceiveKeyboardEventKey,
  TerminalClientMessageHandler,
} from "../client/websocket";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../client/AsciiPayAuthenticationClient";
import { PaymentDialog } from "../payment/PaymentDialog";
import { TerminalNavigateHandler } from "../TerminalApp";

const StyledPaymentPageLeft = styled.div`
  position: absolute;
  left: 0;
  width: 60%;
  top: 0;
  height: 100%;
`;
const StyledPaymentPageRight = styled.div`
  position: absolute;
  left: 60%;
  right: 0;
  top: 0;
  height: 100%;
`;
const StyledPaymentPageSummary = styled.div`
  position: absolute;
  bottom: 0;
  height: 3.2em;
  padding: 0 1em 0.2em;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1em;
  background-color: var(--secondary-hover-background);
  border-top: solid 1px var(--border-color);
  border-left: solid 1px var(--border-color);

  & > div {
    display: flex;
    align-items: center;
  }

  & > span:last-child {
    color: var(--theme-color);
    font-weight: bold;
  }

  & svg {
    width: 0.7em !important;
    height: 0.7em !important;
  }

  .disabled {
    color: var(--secondary-text-color) !important;
  }
`;

enum Page {
  QUICK,
  KEYPAD,
  PRODUCTS,
}

export const TerminalPaymentPage = (props: {
  authClient: AsciiPayAuthenticationClient;
  deviceContext: TerminalDeviceContext;
  navigate: TerminalNavigateHandler;
}) => {
  const { t } = useTranslation();
  const handleGoBack = () => props.navigate("start");

  const [activePage, setActivePage] = useState(Page.QUICK);

  const keypadValue = useTerminalSelector(
    (state) => state.paymentState.keypadValue
  );
  const paymentTotal = useTerminalSelector(
    (state) => state.paymentState.paymentTotal
  );
  const storedPaymentItems = useTerminalSelector(
    (state) => state.paymentState.storedPaymentItems
  );
  const paymentPayment = useTerminalSelector(
    (state) => state.paymentState.payment
  );
  const dispatch = useTerminalDispatch();

  const payAction = () => {
    dispatch(
      payment([
        t("payment.basket.keypadValuePositive"),
        t("payment.basket.keypadValueNegative"),
      ])
    );
    props.authClient.requestNfcReauthenticate();
  };

  const handler: TerminalClientMessageHandler = {
    onReceiveSessionToken(token: string) {
      props.deviceContext.wakeUp();
      dispatch(setScreensaver(false));
      dispatch(receiveAccountSessionToken(token));
      return true;
    },
    onNfcCardRemoved() {
      dispatch(removeAccount());
      return true;
    },
    onReceiveKeyboardEvent(key: ReceiveKeyboardEventKey) {
      props.deviceContext.wakeUp();
      dispatch(setScreensaver(false));
      if (key === "ENTER") {
        payAction();
      } else {
        dispatch(receiveKeyEvent(key));
      }
      return true;
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  const quickActions: SidebarAction[] = [
    {
      title: t("payment.quickAccess"),
      element: <Apps />,
      action: () => setActivePage(Page.QUICK),
      active: activePage === Page.QUICK,
    },
    {
      title: t("payment.keypad"),
      element: <CalculateOutlined />,
      action: () => setActivePage(Page.KEYPAD),
      active: activePage === Page.KEYPAD,
    },
    {
      title: t("payment.productList"),
      element: <ManageSearch />,
      action: () => setActivePage(Page.PRODUCTS),
      active: activePage === Page.PRODUCTS,
    },
    {
      title: t("general.enableScreensaver"),
      element: <ClockIcon />,
      action: (event) => {
        event.stopPropagation();
        dispatch(setScreensaver(true));
      },
      bottom: true,
    },
  ];

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
            let label =
              value >= 0
                ? t("payment.basket.keypadValuePositive")
                : t("payment.basket.keypadValueNegative");
            dispatch(submitKeypadValue([value, label]));
          }}
        />
      );
      break;
    case Page.PRODUCTS:
      content = <ProductList />;
      break;
  }

  return (
    <SidebarLayout defaultAction={handleGoBack} content={quickActions}>
      <StyledPaymentPageLeft>{content}</StyledPaymentPageLeft>
      <StyledPaymentPageRight>
        <ScannedAccount authClient={props.authClient} />
        <Basket />
        <StyledPaymentPageSummary>
          <Money value={paymentTotal.Cent ?? 0} />
          <Stamp value={-(paymentTotal.CoffeeStamp ?? 0)} type="CoffeeStamp" />
          <Stamp value={-(paymentTotal.BottleStamp ?? 0)} type="BottleStamp" />
          <span
            onClick={payAction}
            className={
              storedPaymentItems.length > 0 || keypadValue !== 0
                ? "enabled"
                : "disabled"
            }
          >
            {t("payment.pay")}
          </span>
        </StyledPaymentPageSummary>
      </StyledPaymentPageRight>
      {paymentPayment ? (
        <PaymentDialog
          payment={paymentPayment}
          onClose={() => dispatch(cancelPayment())}
        />
      ) : (
        <></>
      )}
    </SidebarLayout>
  );
};
