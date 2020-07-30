import * as React from "react";

import "./Customer.scss";

export interface CustomerProps {  }
export interface CustomerState {  }

export class Customer extends React.Component<CustomerProps, CustomerState> {
    static displayName = "Customer"

    render() {
        return <div>Customer</div>;
    }
}
