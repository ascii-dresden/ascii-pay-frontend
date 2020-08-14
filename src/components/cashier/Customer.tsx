import * as React from "react";

import "./Customer.scss";
import { registerEventHandler, EventHandler, removeEventHandler } from "../../app/core/api";
import { Account } from "../../app/core/models";
import { MdCancel } from "react-icons/md";

export interface CustomerProps { }
export interface CustomerState {
    account: Account
}

export class Customer extends React.Component<CustomerProps, CustomerState> implements EventHandler {
    static displayName = "Customer"

    constructor(props: CustomerProps) {
        super(props);

        this.state = {
            account: null
        };
    }

    removeAccount() {
        this.setState({
            account: null
        });
    }

    render() {
        if (this.state.account) {
            return <div className="customer">
                <div>
                    <span>{this.state.account.name}</span>
                    <span>{(this.state.account.credit / 100).toFixed(2)}€</span>
                </div>
                <div onClick={() => this.removeAccount()}><MdCancel /></div>
            </div>;
        } else {
            return <div className="customer">No customer scanned!</div>;
        }

    }

    onAccountScanned(account: Account) {
        this.setState({
            account
        });
    }

    componentDidMount() {
        registerEventHandler(this);
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }
}
