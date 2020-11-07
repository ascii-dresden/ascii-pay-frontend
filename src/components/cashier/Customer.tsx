import * as React from "react";

import "./Customer.scss";
import { Account } from "../../app/core/models";
import { MdCancel } from "react-icons/md";

export interface CustomerProps { 
    account: Account|null,
    removeAccount: () => void,
}
export interface CustomerState {}

export class Customer extends React.Component<CustomerProps, CustomerState> {
    static displayName = "Customer"

    removeAccount() {
        this.props.removeAccount();
    }

    render() {
        if (this.props.account) {
            return <div className="customer">
                <div>
                    <span>{this.props.account.name}</span>
                    <span>{(this.props.account.credit / 100).toFixed(2)}€</span>
                </div>
                <div onClick={() => this.removeAccount()}><MdCancel /></div>
            </div>;
        } else {
            return <div className="customer">No customer scanned!</div>;
        }
    }
}
