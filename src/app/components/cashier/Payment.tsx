import * as React from "react";

import "./Payment.scss";
import { MdPayment, MdDone, MdErrorOutline, MdHourglassEmpty } from "react-icons/md";
import { Dialog } from "../Dialog";

export interface PaymentProps {
    data: PaymentData,
    close: () => void
}
export interface PaymentState { }

export interface PaymentData {
    amount: number,
    status: PaymentStatus,
}

export enum PaymentStatus {
    Waiting, Success, Timeout, AuthenticationError, PaymentError
}

export class Payment extends React.Component<PaymentProps, PaymentState> {
    timeout: NodeJS.Timeout|null = null;
    static displayName = "Payment";

    render() {
        let status;
        var message = "";
        switch (this.props.data.status as PaymentStatus) {
            case PaymentStatus.Success:
                status = <div className="payment-status payment-success">
                    <MdDone />
                </div>;
                break;
            case PaymentStatus.Timeout:
                status = <div className="payment-status payment-warn">
                    <MdHourglassEmpty />
                </div>;
                message = "Timeout";
                break;
            case PaymentStatus.AuthenticationError:
                status = <div className="payment-status payment-error">
                    <MdErrorOutline />
                </div>;
                message = "Authentication error";
                break;
            case PaymentStatus.PaymentError:
                status = <div className="payment-status payment-error">
                    <MdErrorOutline />
                </div>;
                message = "Payment error";
                break;
            default:
                status = <div className="payment-status">
                    <MdPayment />
                </div>;
                break;
        }

        let actionList = [
            {
                label: "Cancel",
                action: () => this.props.close()
            }
        ];

        return <Dialog title="Payment" actions={actionList}>
            {status}
            <div className="payment-message">{message}</div>
            <div className="payment-amount">{(this.props.data.amount / 100).toFixed(2)}€</div>
        </Dialog>;
    }

    checkTimeout() {
        if (this.timeout === null && this.props.data.status !== PaymentStatus.Waiting) {
            let t = 5000;
            if (this.props.data.status === PaymentStatus.Success) {
                t = 2000;
            }
            let close = this.props.close;
            this.timeout = setTimeout(() => {
                close();
            }, t);
        }
    }

    componentDidMount() {
        this.checkTimeout()
    }

    componentDidUpdate() {
        this.checkTimeout()
    }

    componentWillUnmount() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
    }
}
