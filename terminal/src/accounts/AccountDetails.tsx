import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_ACCOUNT } from '../graphql';
import './AccountDetails.scss';

export default function AccountDetails(props: { id: string }) {
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    fetchPolicy: 'network-only',
    variables: {
      id: props.id,
    },
  });

  if (error) {
    return <></>;
  }

  let account = {
    name: '',
    username: '',
    accountNumber: '',
    permission: '',
  };
  if (!loading) {
    account = data.getAccount;
  }

  return (
    <div className="account-details form">
      <div>
        <label>Name</label>
        <input readOnly={true} value={account.name} />
      </div>
      <div>
        <label>Username</label>
        <input readOnly={true} value={account.username} />
      </div>
      <div>
        <label>Account number</label>
        <input readOnly={true} value={account.accountNumber} />
      </div>
      <div>
        <label>Permission</label>
        <input readOnly={true} value={account.permission} />
      </div>
    </div>
  );
}
