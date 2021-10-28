import { useApolloClient, useQuery } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import { AsciiPayAuthenticationClient, WebSocketMessageHandler } from '../ascii-pay-authentication-client';
import Dialog from '../components/Dialog';
import { GET_ACCOUNT } from '../graphql';
import { Permission } from '../types/graphql-global';
import { getAccount, getAccountVariables, getAccount_getAccount } from '../__generated__/getAccount';
import './AccountDetails.scss';

export default function AccountDetails(props: { id: string; authClient: AsciiPayAuthenticationClient }) {
  const client = useApolloClient();
  const { loading, error, data } = useQuery<getAccount, getAccountVariables>(GET_ACCOUNT, {
    fetchPolicy: 'network-only',
    variables: {
      id: props.id,
    },
  });

  const [registerNfc, setRegisterNfc] = useState(
    null as {
      id: string;
      name: string;
    } | null
  );
  const [registerAccountNumber, setRegisterAccountNumber] = useState(null as string | null);

  let account: getAccount_getAccount = {
    __typename: 'AccountOutput',
    id: '',
    name: '',
    username: '',
    accountNumber: '',
    permission: Permission.DEFAULT,
  };
  if (!loading && !error && data) {
    account = data.getAccount;
  }

  const handler: WebSocketMessageHandler = {
    onFoundUnknownNfcCard(id: string, name: string) {
      setRegisterAccountNumber(null);
      setRegisterNfc({
        id,
        name,
      });
      return true;
    },
    onFoundAccountNumber(accountNumber: string) {
      setRegisterNfc(null);
      setRegisterAccountNumber(accountNumber);
      return true;
    },
    onNfcCardRemoved() {
      setRegisterNfc(null);
      return true;
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    props.authClient.requestAccountAccessToken();
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  // const setAccountNumber = useCallback(
  //   (id: string, accountNumber: string) => {

  //     mutateFunction({
  //       variables: {
  //         username: username,
  //         password: password,
  //         accountAccessToken: null,
  //       },
  //     }).catch(() => {
  //       // login failed
  //     });
  //   },
  //   [mutateFunction]
  // );

  let addView = <></>;
  if (registerNfc && account.id) {
    let action = [
      {
        label: 'Register nfc card',
        action: () => {
          if (account.id) {
            props.authClient.registerNfcCard(account.id);
            setRegisterNfc(null);
          }
        },
      },
      {
        label: 'Cancel',
        action: () => {
          setRegisterNfc(null);
        },
      },
    ];
    addView = (
      <Dialog title="Found new nfc card" actions={action}>
        <div className="form">
          <div>
            <label>NFC Type</label>
            <input readOnly={true} value={registerNfc.name} />
          </div>
          <div>
            <label>NFC ID</label>
            <input readOnly={true} value={registerNfc.id} />
          </div>
        </div>
      </Dialog>
    );
  } else if (registerAccountNumber && account.id) {
    let action = [
      {
        label: 'Register account number',
        action: () => {
          if (account.id) {
            // TODO
            setRegisterAccountNumber(null);
          }
        },
      },
      {
        label: 'Cancel',
        action: () => {
          setRegisterAccountNumber(null);
        },
      },
    ];
    addView = (
      <Dialog title="Found account number" actions={action}>
        <div className="form">
          <div>
            <label>Account number</label>
            <input readOnly={true} value={registerAccountNumber} />
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <div className="account-details form">
      <div>
        <label>Name</label>
        <input readOnly={true} value={account.name || ''} />
      </div>
      <div>
        <label>Username</label>
        <input readOnly={true} value={account.username || ''} />
      </div>
      <div>
        <label>Account number</label>
        <input readOnly={true} value={account.accountNumber || ''} />
      </div>
      <div>
        <label>Permission</label>
        <input readOnly={true} value={account.permission || ''} />
      </div>
      {addView}
    </div>
  );
}
