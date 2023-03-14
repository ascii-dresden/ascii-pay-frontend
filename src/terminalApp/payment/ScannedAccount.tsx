import React from "react";
import { useTranslation } from "react-i18next";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import { Cancel, Refresh } from "@mui/icons-material";
import styled from "@emotion/styled";
import { removeAccount } from "../redux/features/paymentSlice";
import { AsciiPayAuthenticationClient } from "../client/AsciiPayAuthenticationClient";
import { CoinAmountView } from "../../dashboardApp/components/transaction/CoinAmountView";
import {
  NotificationColor,
  NotificationType,
  showNotification,
} from "../redux/features/terminalSlice";

const StyledScannedAccount = styled.div`
  position: relative;
  height: 4.4em;
  line-height: 4.4em;
  text-align: center;

  background-color: var(--secondary-hover-background);
  border-bottom: solid 1px var(--border-color);
  border-left: solid 1px var(--border-color);
`;
const StyledScannedAccountName = styled.div`
  line-height: 1.4em;
  text-align: left;
  padding: 0.8em 1em 0.4em;
  font-weight: bold;
`;
const StyledScannedAccountTags = styled.div`
  display: flex;
  line-height: 1em;
  padding-left: 1em;

  div {
    display: flex;
    justify-content: center;
    margin-left: 1em;
  }
`;
const StyledScannedAccountRemove = styled.div`
  svg {
    position: absolute;
    top: 50%;
    margin-top: -0.6em;
    right: 1em;

    width: 1.2em;
    height: 1.2em;
  }
`;
const StyledScannedAccountEmpty = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > span {
    display: block;
    padding-left: 2em;
  }
`;
const StyledScannedAccountRefresh = styled.div`
  width: 4.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
`;

export const ScannedAccount = (props: {
  authClient: AsciiPayAuthenticationClient;
}) => {
  const { t } = useTranslation();
  const scannedAccount = useTerminalSelector(
    (state) => state.paymentState.scannedAccount
  );
  const dispatch = useTerminalDispatch();

  if (scannedAccount === null) {
    return (
      <StyledScannedAccount>
        <StyledScannedAccountEmpty>
          <span>{t("payment.noAccount")}</span>
          <StyledScannedAccountRefresh
            onClick={() => {
              dispatch(
                showNotification({
                  type: NotificationType.NFC,
                  title: "identify",
                  color: NotificationColor.INFO,
                  key: "nfc-proxy",
                })
              );
              props.authClient.requestNfcReauthenticate();
            }}
          >
            <Refresh />
          </StyledScannedAccountRefresh>
        </StyledScannedAccountEmpty>
      </StyledScannedAccount>
    );
  }

  return (
    <StyledScannedAccount>
      <StyledScannedAccountName>{scannedAccount.name}</StyledScannedAccountName>
      <StyledScannedAccountTags>
        <CoinAmountView coins={scannedAccount.balance} negativeIsError={true} />
      </StyledScannedAccountTags>
      <StyledScannedAccountRemove onClick={() => dispatch(removeAccount())}>
        <Cancel />
      </StyledScannedAccountRemove>
    </StyledScannedAccount>
  );
};
