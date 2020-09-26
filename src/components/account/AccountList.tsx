import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./AccountList.scss";

import { Account } from "../../app/core/models";

export interface AccountListProps {
    accountList: Account[],
    selectedAccount: Account|null
    selectAccount: (account: Account) => void
}
export interface AccountListState {
    search: string,
}

export class AccountList extends React.Component<AccountListProps, AccountListState> {
    static displayName = "AccountList"

    constructor(props: AccountListProps) {
        super(props);
        this.state = {
            search: "",
        };
    }

    render() {
        let list = this.props.accountList.filter((a) => {
            return a.name.toLowerCase().includes(this.state.search.toLowerCase())
                || a.mail != null && a.mail.toLowerCase().includes(this.state.search.toLowerCase())
                || a.account_number != null && a.account_number.toLowerCase().includes(this.state.search.toLowerCase())
                || a.username != null && a.username.toLowerCase().includes(this.state.search.toLowerCase());
        }).map((a) => {
            let active = a.id == this.props.selectedAccount?.id ? " active" : ""
            return <div key={a.id} className={"account-list-entry" + active} onClick={() => this.props.selectAccount(a)}>
                {a.name}
            </div>
        });

        return <div id="account-list">
            <div className="account-list-content">
                {list}
            </div>
            <div className="account-list-search form">
                <input value={this.state.search} placeholder="Search…" onChange={(e) => this.setState({search: e.target.value})} />
            </div>
        </div>;
    }
}
