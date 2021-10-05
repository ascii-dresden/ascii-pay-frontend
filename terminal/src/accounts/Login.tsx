import { useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { SiContactlesspayment } from 'react-icons/si';
import { AsciiPayAuthenticationClient, WebSocketMessageHandler } from '../ascii-pay-authentication-client';
import { GET_SELF, LOGIN } from '../graphql';
import { login, loginVariables } from '../__generated__/login';
import './Login.scss';

export default function Login(props: { authClient: AsciiPayAuthenticationClient }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [mutateFunction, { data, loading, error }] = useMutation<login, loginVariables>(LOGIN);
  const client = useApolloClient();

  const onLogin = (values: any) => {
    mutateFunction({
      variables: {
        username: username,
        password: password,
        accountAccessToken: null,
      },
    }).catch(() => {
      // login failed
    });
  };

  if (data) {
    localStorage['token'] = data.login.token;
    client.refetchQueries({
      include: [GET_SELF],
    });
  }

  const handler: WebSocketMessageHandler = {
    onFoundAccountAccessToken(access_token: string) {
      mutateFunction({
        variables: {
          username: null,
          password: null,
          accountAccessToken: access_token,
        },
      }).catch(() => {
        // login failed
      });
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
  });

  let errorView = <></>;
  if (error) {
    errorView = <div className="login-error">Login failed!</div>;
  }

  return (
    <div className="login">
      <span>Please login to access the account list!</span>
      <div className="login-split">
        <div className="form">
          <div>
            <label>Username</label>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} onClick={onLogin}>
            Login
          </button>
          {errorView}
        </div>
        <div>
          <SiContactlesspayment />
        </div>
      </div>
    </div>
  );
}
