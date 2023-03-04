import React from "react";
import { useTranslation } from "react-i18next";
import { AsciiPayAuthenticationClient } from "../client/AsciiPayAuthenticationClient";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import styled from "@emotion/styled";
import { TerminalClientMessageHandler } from "../client/websocket";
import { CardTypeDto } from "../../redux/api/contracts";
import { BASE_URL } from "../../redux/api/customFetchBase";
import {
  NotificationColor,
  NotificationType,
  showNotification,
} from "../../redux/features/terminalSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Dialog } from "../components/Dialog";
import { base64ToHex } from "../../components/nfcUtils";

const StyledAccountDetails = styled.div`
  position: absolute;
  top: 4.4em;
  left: 16em;
  right: 0;
  bottom: 0;
  padding: 0.5em 1em 0.5em 0.5em;
  overflow-y: auto;
`;

export const AccountDetails = (props: {
  accountId: number;
  authClient: AsciiPayAuthenticationClient;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.paymentState.scannedToken);

  const {
    isLoading,
    data: account,
    refetch,
  } = useGetAccountQuery(props.accountId);

  const [registerCard, setRegisterCard] = React.useState<{
    name: string;
    card_id: string;
  } | null>(null);

  React.useEffect(() => {
    const handler: TerminalClientMessageHandler = {
      onReceiveUnregisteredNfcCard(
        name: string,
        card_id: string
      ): void | boolean {
        setRegisterCard({ name, card_id });
        return true;
      },
      onNfcCardRemoved(): void | boolean {
        setRegisterCard(null);
        return true;
      },
      onNfcRegisterRequest(
        name: string,
        card_id: string,
        card_type: CardTypeDto,
        data: string | null | undefined
      ): void | boolean {
        setRegisterCard(null);

        fetch(`${BASE_URL}/account/${props.accountId}/nfc-authentication`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            card_id,
            card_type,
            data,
          }),
        })
          .then((response) => response.json())
          .then(() => {
            refetch();
            dispatch(
              showNotification({
                type: NotificationType.NFC,
                color: NotificationColor.INFO,
                title: "Card successfully registered!",
              })
            );
          })
          .catch(() =>
            dispatch(
              showNotification({
                type: NotificationType.NFC,
                color: NotificationColor.ERROR,
                title: "Could not register card!",
              })
            )
          );

        return true;
      },
    };

    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  if (isLoading || !account) {
    return <StyledAccountDetails className="form"></StyledAccountDetails>;
  }

  let addView = <></>;
  if (registerCard && account.id) {
    let action = [
      {
        label: t("account.registerNfcToken"),
        action: () => {
          if (account.id) {
            props.authClient.requestNfcRegister(registerCard.card_id);
          }
        },
      },
      {
        label: t("general.cancel"),
        action: () => {
          setRegisterCard(null);
        },
      },
    ];
    addView = (
      <Dialog title={t("account.foundNewNfcToken")} actions={action}>
        <div className="form">
          <div>
            <label>NFC Type</label>
            <input readOnly={true} value={registerCard.name} />
          </div>
          <div>
            <label>NFC ID</label>
            <input readOnly={true} value={base64ToHex(registerCard.card_id)} />
          </div>
        </div>
      </Dialog>
    );
  }

  let nfc = account.auth_methods
    .filter((token) => token.type === "NfcBased")
    .map((token) => {
      if (token.type !== "NfcBased") {
        return null;
      }
      return (
        <div key={token.card_id}>
          <label>{t("account.nfcToken")}</label>
          <div className="input-group">
            <input
              readOnly={true}
              value={token.name + ": '" + base64ToHex(token.card_id) + "'"}
            />
          </div>
        </div>
      );
    });

  return (
    <StyledAccountDetails className="form">
      <div>
        <label>{t("account.name")}</label>
        <input readOnly={true} value={account.name || ""} />
      </div>
      {nfc}
      {addView}
    </StyledAccountDetails>
  );
};
