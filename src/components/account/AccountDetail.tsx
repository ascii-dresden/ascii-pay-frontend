import * as React from "react";


import { registerEventHandler, EventHandler, removeEventHandler, addAccountNfcTag, reauthenticate } from "../../app/core/api";

import "./AccountDetail.scss";

import { Account } from "../../app/core/models";

export interface AccountDetailProps {
    account: Account
}
export interface AccountDetailState {
    nfc: string|null,
    nfcWritable: boolean|null,
    barCode: string|null
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
            await addAccountNfcTag(this.props.account, this.state.nfc, this.state.nfcWritable);
            if (this.state.nfcWritable) {
                await reauthenticate();
            }
        })();
    }

    render() {
        let newNfcButton;
        if (this.state.nfc) {
            newNfcButton = <div onClick={() => this.registerNfcTag()}><span>Register new nfc</span></div>;
        }
        return <div id="account-detail">
            <div>
                <label>Name</label>
                <input value={this.props.account.name} readOnly={true} />
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
