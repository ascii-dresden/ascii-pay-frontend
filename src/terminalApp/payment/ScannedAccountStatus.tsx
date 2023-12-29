import React from "react";
import { useTerminalSelector } from "../redux/terminalStore";
import styled from "@emotion/styled";
import { getStatusColor } from "../../common/statusColors";
import { TerminalSettings } from "../pages/TerminalSettingsPage";

const StyledScannedAccountStatus = styled.div`
  position: absolute;
  top: 4.4em;
  height: 1.6em;
  left: 0;
  right: 0;
  line-height: 1.6em;
  text-align: center;

  background-color: var(--secondary-hover-background);
  border-bottom: solid 1px var(--border-color);
  border-left: solid 1px var(--border-color);

  span {
    font-size: 0.8em;
  }
`;
const StyledScannedAccountStatusEmpty = styled.div`
  position: absolute;
  top: 4.4em;
  height: 1.6em;
  left: 0;
  right: 0;
  border-bottom: solid 1px var(--border-color);
`;

export const ScannedAccountStatus = (props: { settings: TerminalSettings }) => {
  const scannedAccount = useTerminalSelector(
    (state) => state.paymentState.scannedAccount
  );
  const status = scannedAccount?.status ?? null;
  if (status === null) {
    return <StyledScannedAccountStatusEmpty />;
  }

  return (
    <StyledScannedAccountStatus
      style={{
        backgroundColor: getStatusColor(status.color, props.settings.theme),
      }}
    >
      <span>{status.name}</span>
    </StyledScannedAccountStatus>
  );
};
