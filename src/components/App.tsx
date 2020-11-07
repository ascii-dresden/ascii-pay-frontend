import * as React from "react";
import { Cashier } from "./cashier/Cashier";
import { AccountView } from "./account/Account";
import { ConnectionStatus, Status } from "./ConnectionStatus";

import { registerEventHandler, EventHandler, removeEventHandler } from "../app/core/api";

import "./App.scss";

import { MdPayment, MdGroup, MdMenu, MdPowerSettingsNew, MdLocalCafe } from "react-icons/md";

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
    menuActive: boolean
}

export class App extends React.Component<AppProps, AppState> implements EventHandler {
    static displayName = "App"

    constructor(props: AppProps) {
        super(props);
        this.state = {
            proxyConnected: true,
            serverConnected: true,
            mode: Mode.Cashier,
            menuActive: false
        };

        this.onMenuToggle = this.onMenuToggle.bind(this);
        this.onCashier = this.onCashier.bind(this);
        this.onAccount = this.onAccount.bind(this);
        this.onProduct = this.onProduct.bind(this);
        this.onLogout = this.onLogout.bind(this);
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

    onLogout() {

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

        var connectionStatus;
        if (!this.state.proxyConnected) {
            connectionStatus = <ConnectionStatus status={Status.NoProxy} />
        } else if (!this.state.serverConnected) {
            connectionStatus = <ConnectionStatus status={Status.NoServer} />
        }

        return <>
            {connectionStatus}
            <div id="sidebar" className={this.state.menuActive ? "active" : ""}>
                <div onClick={this.onMenuToggle}>
                    <MdMenu />
                    <span>Menu</span>
                </div>
                <div onClick={this.onCashier} className={this.state.mode == Mode.Cashier ? "active" : ""}>
                    <MdPayment />
                    <span>Cashier</span>
                </div>
                <div onClick={this.onAccount} className={this.state.mode == Mode.Account ? "active" : ""}>
                    <MdGroup />
                    <span>Accounts</span>
                </div>
                <div onClick={this.onProduct} className={this.state.mode == Mode.Product ? "active" : ""}>
                    <MdLocalCafe />
                    <span>Products</span>
                </div>
                <div onClick={this.onLogout}>
                    <MdPowerSettingsNew />
                    <span>Logout</span>
                </div>
            </div>
            <div id="main">
                {main}
            </div>
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
    }

    componentWillUnmount() {
        removeEventHandler(this);
    }
}
