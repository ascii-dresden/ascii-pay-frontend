import * as React from "react";
import { MdClose, MdDeviceHub, MdDns, MdDone, MdHelpOutline, MdSwapHoriz, MdTablet } from "react-icons/md";

import "./ConnectionStatus.scss";

export enum Status {
    Ok,
    NoServer,
    NoProxy,
}

export interface ConnectionStatusProps {
    status: Status
 }
export interface ConnectionStatusState { }

export class ConnectionStatus extends React.Component<ConnectionStatusProps, ConnectionStatusState> {
    static displayName = "ConnectionStatus"

    render() {
        let proxyArrow;
        let serverArrow;
        let message;

        switch (this.props.status as Status) {
            case Status.Ok: 
                proxyArrow = <div className="success">
                    <MdDone />
                    <MdSwapHoriz />
                </div>;
                serverArrow = <div className="success">
                    <MdDone />
                    <MdSwapHoriz />
                </div>;
                message = "Connection established"
                break;
            case Status.NoServer: 
                proxyArrow = <div className="success">
                    <MdDone />
                    <MdSwapHoriz />
                </div>;
                serverArrow = <div className="error">
                    <MdClose />
                    <MdSwapHoriz />
                </div>;
                message = "Connection to server failed"
                break;
            case Status.NoProxy: 
                proxyArrow = <div className="error">
                    <MdClose />
                    <MdSwapHoriz />
                </div>;
                serverArrow = <div className="">
                    <MdHelpOutline />
                    <MdSwapHoriz />
                </div>;
                message = "Connection to proxy failed"
                break;
        }

        return <div className="dialog">
            <div className="dialog-body dialog-width connection-status">
                <div><h2>Connection</h2></div>
                <div className="connection-icons">
                    <div>
                        <MdTablet />
                    </div>
                    {proxyArrow}
                    <div>
                        <MdDeviceHub />
                    </div>
                    {serverArrow}
                    <div>
                        <MdDns />
                    </div>
                </div>
                <div>
                    {message}
                </div>
            </div>
        </div>;
    }
}
