import * as React from "react";


import { registerEventHandler, EventHandler, removeEventHandler, addAccountNfcTag, reauthenticate } from "../../core/api";

import "./AccountDetail.scss";

import { Account } from "../../core/models";

export interface AccountDetailProps {
    account: Account
}
export interface AccountDetailState {
    nfc: string | null,
    nfcWritable: boolean | null,
    barCode: string | null
}

export class AccountDetail extends React.Component<AccountDetailProps, AccountDetailState> implements EventHandler {
    static displayName = "AccountDetail"

    constructor(props: AccountDetailProps) {
        super(props);

        this.state = {
            nfc: null,
            nfcWritable: null,
            barCode: null,
        };
    }

    registerNfcTag() {
        (async () => {
            let nfc = this.state.nfc;
            let nfcWritable = this.state.nfcWritable
            if (nfc !== null && nfcWritable !== null) {
                await addAccountNfcTag(this.props.account, nfc, nfcWritable);
                if (this.state.nfcWritable) {
                    await reauthenticate();
                }
            }
        })();
    }

    render() {
        let newNfcButton;
        if (this.state.nfc) {
            newNfcButton = <div onClick={() => this.registerNfcTag()}><span>Register new nfc</span></div>;
        }

        let accountName = this.props.account.name;
        if (!accountName) accountName = "";
        let accountCredit = this.props.account.credit;
        let accountMinimumCredit = this.props.account.minimum_credit;
        let accountMail = this.props.account.mail;
        if (!accountMail) accountMail = "";
        let accountUsername = this.props.account.username;
        if (!accountUsername) accountUsername = "";
        let accountAccountNumber = this.props.account.account_number;
        if (!accountAccountNumber) accountAccountNumber = "";
        let accountPermission = this.props.account.permission;


        return <div id="account-detail">
            <div className="form">
                <div>
                    <label>Name</label>
                    <input value={accountName} readOnly={true} />
                </div>
                <div>
                    <label>Credit</label>
                    <input value={(accountCredit / 100).toFixed(2) + "€"} readOnly={true} />
                </div>
                <div>
                    <label>Minimum Credit</label>
                    <input value={(accountMinimumCredit / 100).toFixed(2) + "€"} readOnly={true} />
                </div>
                <div>
                    <label>Mail</label>
                    <input value={accountMail} readOnly={true} />
                </div>
                <div>
                    <label>Username</label>
                    <input value={accountUsername} readOnly={true} />
                </div>
                <div>
                    <label>Account number</label>
                    <input value={accountAccountNumber} readOnly={true} />
                </div>
                <div>
                    <label>Permission</label>
                    <input value={accountPermission} readOnly={true} />
                </div>
            </div>
            {newNfcButton}
        </div>;
    }

    onBarCodeScanned(code: string) {
        this.setState({
            barCode: code
        });
    }

    onNfcCardAdded(id: string, writeable: boolean) {
        this.setState({
            nfc: id,
            nfcWritable: writeable
        });
    }

    onNfcCardRemoved() {
        this.setState({
            nfc: null,
            nfcWritable: null
        });
    }

    componentDidMount() {
        registerEventHandler(this);
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }
}
