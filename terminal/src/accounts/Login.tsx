import React from 'react';
import { SiContactlesspayment } from 'react-icons/si';
import './Login.scss';

export default function Login() {
  return (
    <div className="login">
      <span>Please login to access the account list!</span>
      <div className="login-split">
        <div className="form">
          <div>
            <label>Username</label>
            <input placeholder="Username" />
          </div>
          <div>
            <label>Password</label>
            <input placeholder="Password" type="password" />
          </div>
          <button>Login</button>
        </div>
        <div>
          <SiContactlesspayment />
        </div>
      </div>
    </div>
  );
}
