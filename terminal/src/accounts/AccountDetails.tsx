import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { AsciiPayAuthenticationClient, WebSocketMessageHandler } from '../ascii-pay-authentication-client';
import { GET_ACCOUNT } from '../graphql';
import { Permission } from '../types/graphql-global';
import { getAccount, getAccountVariables, getAccount_getAccount } from '../__generated__/getAccount';
import './AccountDetails.scss';

export default function AccountDetails(props: { id: string; authClient: AsciiPayAuthenticationClient }) {
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

  const handler: WebSocketMessageHandler = (message) => {
    if (message.type === 'FoundUnknownNfcCard') {
      setRegisterNfc({
        id: message.payload.id,
        name: message.payload.name,
      });
    } else {
      setRegisterNfc(null);
    }
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
  });

  let addView = <></>;
  if (registerNfc && account.id) {
    const registerNfcHander = () => {
      if (account.id) {
        props.authClient.registerNfcCard(account.id);
        setRegisterNfc(null);
      }
    };
    addView = (
      <div>
        <label>Found new nfc card</label>
        <input readOnly={true} value={registerNfc.name} />
        <button onClick={registerNfcHander}>Register nfc card</button>
      </div>
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
