import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_ACCOUNTS } from '../graphql';
import './AccountList.scss';

export default function AccountList(props: { onSelect: (id: string) => void }) {
  const { loading, error, data } = useQuery(GET_ACCOUNTS, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <></>;
  }

  if (error) {
    return <></>;
  }

  const accountList = data.getAccounts.map((it: any) => (
    <div key={it.element.id}>
      <span onClick={() => props.onSelect(it.element.id)}>{it.element.name}</span>
    </div>
  ));

  return <div className="account-list">{accountList}</div>;
}
