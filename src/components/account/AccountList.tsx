import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./AccountList.scss";

import { Account } from "../../app/core/models";

export interface AccountListProps {
    accountList: Account[],
    selectAccount: (account: Account) => void
}
export interface AccountListState { }

export class AccountList extends React.Component<AccountListProps, AccountListState> {
    static displayName = "AccountList"

    render() {
        let list = this.props.accountList.map((a) => {
            return <div key={a.id} className="account-list-entry" onClick={() => this.props.selectAccount(a)}>
                {a.name}
            </div>
        });

        return <div id="account-list">
            {list}
        </div>;
    }
}
