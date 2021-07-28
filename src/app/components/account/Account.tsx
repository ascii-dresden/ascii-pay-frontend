import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./Account.scss";

import { Account } from "../../core/models";
import { registerEventHandler, EventHandler, removeEventHandler, addAccountNfcTag, reauthenticate, addAccountBarcode, updateAccount } from "../../core/api";
import { listAccounts } from "../../core/api";

import { AccountList } from "./AccountList";
import { AccountDetail } from "./AccountDetail";
import { Dialog } from "../Dialog";

interface AccountViewNfcRequest {
    id: string,
    writeable: boolean
}

interface AccountViewBarcodeRequest {
    code: string
}

export interface AccountProps { }
export interface AccountState {
    accountList: Account[],
    account: Account|null,
    addNfcRequest: AccountViewNfcRequest|null,
    addBarcodeRequest: AccountViewBarcodeRequest|null,
 }

export class AccountView extends React.Component<AccountProps, AccountState> implements EventHandler {
    static displayName = "Account"

    constructor(props: AccountProps) {
        super(props)

        this.state = {
            accountList: [],
            account: null,
            addNfcRequest: null,
            addBarcodeRequest: null
        };
    }

    selectAccount(account: Account|null) {
        this.setState((s) => {
            let a = s.accountList.find((a) => a.id === account.id);
            return {
                account: a
            }
        });
    }

    addNfcCard() {
        let request = this.state.addNfcRequest;
        if (request === null || this.state.account === null) {
            return
        }
        (async () => {
            await addAccountNfcTag(this.state.account, request.id, request.writeable);
            await reauthenticate();
            this.setState({
                addNfcRequest: null
            });
        })()
    }

    addBarcode() {
        let request = this.state.addBarcodeRequest;
        if (request === null || this.state.account === null) {
            return
        }
        if (request.code.startsWith("https://pay.ascii.coffee?code=")) {
            let account_number = request.code
                .replace("https://pay.ascii.coffee?code=", "")
                .replace(/-/g, " ");

            this.state.account.account_number = account_number;
            (async () => {
                await updateAccount(this.state.account);
                await addAccountBarcode(this.state.account, request.code);
                this.setState({
                    addBarcodeRequest: null
                });
            })()
        } else {
            (async () => {
                await addAccountBarcode(this.state.account, request.code);
                this.setState({
                    addBarcodeRequest: null
                });
            })()
        }
    }

    render() {
        let detail = null;
        let popup = null;
        if (this.state.account !== null) {
            detail = <AccountDetail account={this.state.account} />

            if (this.state.addNfcRequest !== null) {
                let actionList = [
                    {
                        label: "Cancel",
                        action: () => {
                            this.setState({
                                addNfcRequest: null
                            })
                        }
                    },
                    {
                        label: "Add to account",
                        action: () => {
                            this.addNfcCard();
                        }
                    }
                ];
                popup = <Dialog title="Add new NFC Card to account" actions={actionList} large={true}>
                    <div className="form">
                        <div>
                            <label>Account</label>
                            <input value={this.state.account.name} readOnly={true} />
                        </div>
                        <div>
                            <label>NFC Card ID</label>
                            <input value={this.state.addNfcRequest.id} readOnly={true} />
                        </div>
                    </div>
                </Dialog>;
            } else if (this.state.addBarcodeRequest !== null) {
                let actionList = [
                    {
                        label: "Cancel",
                        action: () => {
                            this.setState({
                                addBarcodeRequest: null
                            })
                        }
                    },
                    {
                        label: "Add to account",
                        action: () => {
                            this.addBarcode();
                        }
                    }
                ];
                let request = this.state.addBarcodeRequest;
                if (request.code.startsWith("https://pay.ascii.coffee?code=")) {
                    let account_number = request.code
                        .replace("https://pay.ascii.coffee?code=", "")
                        .replace(/-/g, " ");
        
                    this.state.account.account_number = account_number;
                    
                    popup = <Dialog title="Add new account number to account" actions={actionList} large={true}>
                        <div className="form">
                            <div>
                                <label>Account</label>
                                <input value={this.state.account.name} readOnly={true} />
                            </div>
                            <div>
                                <label>Account number</label>
                                <input value={account_number} readOnly={true} />
                            </div>
                        </div>
                    </Dialog>;
                } else {
                    popup = <Dialog title="Add new barcode to account" actions={actionList} large={true}>
                        <div className="form">
                            <div>
                                <label>Account</label>
                                <input value={this.state.account.name} readOnly={true} />
                            </div>
                            <div>
                                <label>Barcode</label>
                                <input value={request.code} readOnly={true} />
                            </div>
                        </div>
                    </Dialog>;
                }
                
            }
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
            {popup}
        </div>;
    }

    onAccountScanned(account: Account) {
        this.selectAccount(account);
    }
    
    onBarCodeScanned(code: string) {
        if (this.state.account !== null) {
            this.setState({
                addBarcodeRequest: {
                    code: code
                }
            });
        }
    }

    onNfcCardAdded(id: string, writeable: boolean) {
        if (this.state.account !== null) {
            this.setState({
                addNfcRequest: {
                    id: id,
                    writeable: writeable
                }
            });
        }
    }

    onNfcCardRemoved() {
        this.setState({
            addNfcRequest: null
        });
    }

    componentDidMount() {
        registerEventHandler(this);

        (async () => {
            let accountList = await listAccounts();
            this.setState({
                accountList: accountList
            });
        })()
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }
}
