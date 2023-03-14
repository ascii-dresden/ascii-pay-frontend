import React from "react";
import Stamp from "../components/Stamp";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Close, Done, ErrorOutline, HelpOutline } from "@mui/icons-material";
import { useTerminalDispatch } from "../redux/terminalStore";
import { ContactlessPayment } from "../../assets/ContactlessPayment";
import {
  PaymentPayment,
  paymentProceedWithoutStamps,
  paymentProceedWithStamps,
  receiveAccountSessionToken,
} from "../redux/features/paymentSlice";
import { Money } from "../components/Money";
import { createPortal } from "react-dom";

const StyledPaymentDialog = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 10;
`;
const StyledPaymentDialogBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0.5;
`;
const StyledPaymentDialogWindow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20em;
  margin-left: -10em;
  height: 24em;
  margin-top: -12em;
  background-color: var(--secondary-background);
  border: solid 1px var(--border-color);
`;
const StyledPaymentDialogCancel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 4em;
  height: 3em;
  line-height: 3em;
  text-align: center;
`;
const StyledPaymentDialogTitle = styled.div`
  position: absolute;
  top: 2.5em;
  left: 50%;
  margin-left: -5em;
  height: 10em;
  width: 10em;
  font-size: 1.2em;
  text-align: center;
  font-weight: bold;
`;
const StyledPaymentDialogStatus = styled.div`
  position: absolute;
  top: 5em;
  left: 50%;
  margin-left: -5em;
  height: 10em;
  width: 10em;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 8em;
    height: 8em;
  }
`;
const StyledPaymentDialogMessage = styled.div`
  position: absolute;
  bottom: 2em;
  width: 100%;
  left: 0;
  text-align: center;
`;
const StyledPaymentDialogContent = styled.div`
  position: absolute;
  top: 15em;
  left: 50%;
  margin-left: -4em;
  width: 8em;
  gap: 0.6em;

  display: flex;
  flex-direction: column;

  & > div {
    display: flex;
    justify-content: center;
    gap: 1.2em;

    &:first-of-type {
      font-size: 1.2em;
      font-weight: bold;
    }
  }

  button {
    appearance: none;
    background-color: var(--primary-background);
    color: var(--primary-text-color);
    border: solid 1px var(--border-color);
    padding: 0.5em;
    margin-top: 1em;
    height: 3.2em;
  }

  &.left {
    left: 28%;
  }

  &.right {
    left: 72%;
  }
`;
const StyledPaymentStatus = styled.div`
  &.success {
    color: var(--success-color);
  }

  &.warn {
    color: var(--warn-color);
  }

  &.error {
    color: var(--error-color);
  }
`;

export const PaymentDialog = (props: {
  payment: PaymentPayment;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useTerminalDispatch();

  let status;
  let message = "";
  let title = "";

  switch (props.payment.type) {
    case "Success":
      status = (
        <StyledPaymentStatus className="success">
          <Done />
        </StyledPaymentStatus>
      );
      break;
    case "ReCalculateStamps":
      status = (
        <StyledPaymentStatus className="warn">
          <HelpOutline />
        </StyledPaymentStatus>
      );
      title = t("payment.redeemStamps");
      break;
    case "Error":
      status = (
        <StyledPaymentStatus className="error">
          <ErrorOutline />
        </StyledPaymentStatus>
      );
      message = props.payment.message;
      break;
    default:
      status = (
        <StyledPaymentStatus className="payment-status">
          <ContactlessPayment />
        </StyledPaymentStatus>
      );
      break;
  }

  let proceedWithStamps = () => {
    if (props.payment.type === "ReCalculateStamps") {
      let accessToken = props.payment.accountAccessToken;
      dispatch(paymentProceedWithStamps());

      setTimeout(() => {
        dispatch(receiveAccountSessionToken(accessToken));
      }, 500);
    }
  };
  let proceedWithoutStamps = () => {
    if (props.payment.type === "ReCalculateStamps") {
      let accessToken = props.payment.accountAccessToken;
      dispatch(paymentProceedWithoutStamps());

      setTimeout(() => {
        dispatch(receiveAccountSessionToken(accessToken));
      }, 500);
    }
  };

  let leftContent = (
    <StyledPaymentDialogContent
      className={props.payment.type === "ReCalculateStamps" ? "left" : ""}
    >
      <div>
        <Money value={props.payment.total.Cent ?? 0} />
      </div>
      <div>
        <Stamp
          value={props.payment.total.CoffeeStamp ?? 0}
          type="CoffeeStamp"
        />
        <Stamp
          value={props.payment.total.BottleStamp ?? 0}
          type="BottleStamp"
        />
      </div>
      {props.payment.type === "ReCalculateStamps" ? (
        <button onClick={proceedWithoutStamps}>
          {t("payment.proceedWithoutStamps")}
        </button>
      ) : null}
    </StyledPaymentDialogContent>
  );

  let rightContent;
  if (props.payment.type === "ReCalculateStamps") {
    rightContent = (
      <StyledPaymentDialogContent className="right">
        <div>
          <Money value={props.payment.withStamps.total.Cent ?? 0} />
        </div>
        <div>
          <Stamp
            value={props.payment.withStamps.total.CoffeeStamp ?? 0}
            type="CoffeeStamp"
          />
          <Stamp
            value={props.payment.withStamps.total.BottleStamp ?? 0}
            type="BottleStamp"
          />
        </div>
        <button onClick={proceedWithStamps}>
          {t("payment.proceedWithStamps")}
        </button>
      </StyledPaymentDialogContent>
    );
  }

  const content = (
    <StyledPaymentDialog>
      <StyledPaymentDialogBackground
        onClick={props.onClose}
      ></StyledPaymentDialogBackground>
      <StyledPaymentDialogWindow>
        <StyledPaymentDialogCancel onClick={props.onClose}>
          <Close />
        </StyledPaymentDialogCancel>
        <StyledPaymentDialogTitle>{title}</StyledPaymentDialogTitle>
        <StyledPaymentDialogStatus>{status}</StyledPaymentDialogStatus>
        <StyledPaymentDialogMessage>{message}</StyledPaymentDialogMessage>
        {leftContent}
        {rightContent}
      </StyledPaymentDialogWindow>
    </StyledPaymentDialog>
  );

  const container = document.getElementById("terminal-dialog-portal");
  return createPortal(content, container!);
};
