import * as React from "react";
import { ConnectionStatus, Status } from "./ConnectionStatus";

import "./ConnectionStatusDialog.scss";

export interface ConnectionStatusDialogProps {
    status: Status
 }
export interface ConnectionStatusDialogState { }

export class ConnectionStatusDialog extends React.Component<ConnectionStatusDialogProps, ConnectionStatusDialogState> {
    static displayName = "ConnectionStatusDialog"

    render() {
        let message;

        switch (this.props.status as Status) {
            case Status.Ok: 
                message = "Connection established"
                break;
            case Status.NoServer: 
                message = "Connection to server failed"
                break;
            case Status.NoProxy: 
                message = "Connection to proxy failed"
                break;
        }

        return <div className="dialog">
            <div className="dialog-body dialog-width connection-status-dialog">
                <div><h2>Connection</h2></div>
                <ConnectionStatus status={this.props.status} />
                <div>
                    {message}
                </div>
            </div>
        </div>;
    }
}
