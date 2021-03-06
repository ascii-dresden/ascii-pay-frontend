import * as React from "react";
import { MdPayment, MdGroup, MdMenu, MdPowerSettingsNew, MdLocalCafe } from "react-icons/md";
import IdleTimer from 'react-idle-timer'

import { Cashier } from "./cashier/Cashier";
import { AccountView } from "./account/Account";
import { Status } from "./ConnectionStatus";
import { Screensaver } from "./Screensaver";
import { ConnectionStatusDialog } from "./ConnectionStatusDialog";

import { registerEventHandler, EventHandler, removeEventHandler } from "../app/core/api";

import "./App.scss";

enum Mode {
    Cashier,
    Account,
    Product
}

export interface AppProps { }
export interface AppState {
    proxyConnected: boolean,
    serverConnected: boolean,
    mode: Mode,
    menuActive: boolean,
    screensaver: boolean
}

export class App extends React.Component<AppProps, AppState> implements EventHandler {
    static displayName = "App"

    idleTimer: IdleTimer | null

    constructor(props: AppProps) {
        super(props);

        this.idleTimer = null

        this.state = {
            proxyConnected: true,
            serverConnected: true,
            mode: Mode.Cashier,
            menuActive: false,
            screensaver: false
        };
    }

    handleOnActive() {
        if (this.state.screensaver) {
            this.setState({
                screensaver: false
            });
        }
    }

    handleOnIdle() {
        if (!this.state.screensaver) {
            this.setState({
                screensaver: true
            });
        }
    }

    onMenuToggle() {
        this.setState({
            menuActive: !this.state.menuActive
        });
    }

    onCashier() {
        this.setState({
            mode: Mode.Cashier
        });
    }

    onAccount() {
        this.setState({
            mode: Mode.Account
        });
    }

    onProduct() {
        this.setState({
            mode: Mode.Product
        });
    }

    render() {
        let main;
        switch (this.state.mode as Mode) {
            case Mode.Cashier:
                main = <Cashier />;
                break;
            case Mode.Account:
                main = <AccountView />;
                break;
            case Mode.Product:
                main = <div></div>;
                break;
        }

        let connectionStatus;
        if (!this.state.proxyConnected) {
            connectionStatus = Status.NoProxy;
        } else if (!this.state.serverConnected) {
            connectionStatus = Status.NoServer;
        } else {
            connectionStatus = Status.Ok;
        }

        if (this.state.screensaver) {
            return <>
                <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    timeout={1000 * 60 * 15}
                    onAction={() => this.handleOnActive()}
                    onActive={() => this.handleOnActive()}
                    onIdle={() => this.handleOnIdle()}
                    debounce={250}
                    eventsThrottle={1000} /><Screensaver status={connectionStatus} onAction={() => this.handleOnActive()} />
            </>;
        }

        return <>
            <IdleTimer
                ref={ref => { this.idleTimer = ref }}
                timeout={1000 * 60 * 15}
                onAction={() => this.handleOnActive()}
                onActive={() => this.handleOnActive()}
                onIdle={() => this.handleOnIdle()}
                debounce={250}
                eventsThrottle={1000} />

            <div id="sidebar" className={this.state.menuActive ? "active" : ""}>
                <div onClick={() => this.onMenuToggle()}>
                    <MdMenu />
                    <span>Menu</span>
                </div>
                <div onClick={() => this.onCashier()} className={this.state.mode == Mode.Cashier ? "active" : ""}>
                    <MdPayment />
                    <span>Cashier</span>
                </div>
                <div onClick={() => this.onAccount()} className={this.state.mode == Mode.Account ? "active" : ""}>
                    <MdGroup />
                    <span>Accounts</span>
                </div>
                <div onClick={() => this.onProduct()} className={this.state.mode == Mode.Product ? "active" : ""}>
                    <MdLocalCafe />
                    <span>Products</span>
                </div>
                <div onClick={() => this.handleOnIdle()}>
                    <MdPowerSettingsNew />
                    <span>Logout</span>
                </div>
            </div>
            <div id="main">
                {main}
            </div>
            {connectionStatus !== Status.Ok ? <ConnectionStatusDialog status={connectionStatus} /> : null}
        </>;
    }

    onDisconnect() {
        this.setState({
            proxyConnected: false
        });
    }

    onConnect() {
        this.setState({
            proxyConnected: true
        });
    }

    componentDidMount() {
        registerEventHandler(this);

        window.onresize = this.onresize
        this.onresize();
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }

    onresize() {
        const scale = Math.min(window.innerWidth / 800, window.innerHeight / 480);
        document.documentElement.style.fontSize = Math.round(16 * scale) + "px";
    }
}
