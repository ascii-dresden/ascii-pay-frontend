import * as React from "react";

import "./Barista.scss";

export interface BaristaProps { }
export interface BaristaState { }

export class Barista extends React.Component<BaristaProps, BaristaState> {
    static displayName = "Barista"

    render() {
        return <div className="barista">Barista</div>;
    }
}
