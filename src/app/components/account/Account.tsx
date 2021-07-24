import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./Account.scss";

import { Account } from "../../core/models";
import { listAccounts } from "../../core/api";

import { AccountList } from "./AccountList";
import { AccountDetail } from "./AccountDetail";

export interface AccountProps { }
export interface AccountState {
    accountList: Account[],
    account: Account|null
 }

export class AccountView extends React.Component<AccountProps, AccountState> {
    static displayName = "Account"

    constructor(props: AccountProps) {
        super(props)

        this.state = {
            accountList: [],
            account: null,
        };
    }


    selectAccount(account: Account|null) {
        this.setState({
            account: account
        });
    }

    render() {
        let detail = null;
        if (this.state.account !== null) {
            detail = <AccountDetail account={this.state.account} />
        }
        return <div id="account">
            <div id="account-left">
                <AccountList accountList={this.state.accountList} selectAccount={(account) => this.selectAccount(account)} selectedAccount={this.state.account} />
            </div>
            <div id="account-right">
                <Tabs>
                    <TabList>
                        <Tab>Details</Tab>
                    </TabList>
                    <TabPanel>
                        {detail}
                    </TabPanel>
                </Tabs>
            </div>
        </div>;
    }

    componentDidMount() {
        (async () => {
            let accountList = await listAccounts();
            this.setState({
                accountList: accountList
            });
        })()
    }
}
