import * as React from "react";
import Clock from "react-clock";
import { ConnectionStatus, Status } from "./ConnectionStatus";

import "./Screensaver.scss";
import 'react-clock/dist/Clock.css';


export interface ScreensaverProps {
    status: Status,
    onAction: () => void,
}
export interface ScreensaverState {
    date: Date,
    timestring: string,
    datestring: string,
}

export class Screensaver extends React.Component<ScreensaverProps, ScreensaverState> {
    static displayName = "Screensaver"

    static monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    static dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];

    interval: number | null = null;

    constructor(props: ScreensaverProps) {
        super(props);

        let d = new Date();
        this.state = {
            date: d,
            datestring: Screensaver.dayArray[d.getDay()] + " " + ("0" + d.getDate()).slice(-2) + " " + Screensaver.monthArray[d.getMonth()],
            timestring: ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2),
        };
    }

    render() {
        return <div className="screensaver" onClick={() => this.props.onAction()}>
            <div className="clock-container">
                <Clock value={this.state.date} />
                <div className="date-time-string">
                    <span>{this.state.datestring}</span>
                    <span>{this.state.timestring}</span>
                </div>
            </div>
            { this.props.status !== Status.Ok ? <ConnectionStatus status={this.props.status} /> : null }
        </div>;
    }

    update() {
        let d = new Date();
        this.setState({
            date: d,
            datestring: Screensaver.dayArray[d.getDay()] + " " + ("0" + d.getDate()).slice(-2) + " " + Screensaver.monthArray[d.getMonth()],
            timestring: ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2),
        });
    }

    componentDidMount() {
        this.interval = window.setInterval(() => this.update(), 1000);
    }

    componentWillUnmount() {
        const i = this.interval;
        if (i) {
            this.interval = null;
            window.clearInterval(i);
        }
    }
}
