import { requestProxyJson, Method, BASE_URL } from "./utils";
import { Product, Account } from "../models";

export interface EventHandler {
    onConnect?(): void;
    onDisconnect?(): void;

    onAccountScanned?(account: Account): void;
    onProductScanned?(product: Product): void;
    onBarCodeScanned?(code: string): void;
    onNfcCardAdded?(id: string, writeable: boolean): void;
    onNfcCardRemoved?(): void;
    onPaymentTokenGenerated?(token: string): void;
    onTimeout?(): void;
}

export async function requestPaymentToken(amount: number) {
    return await requestProxyJson(
        Method.POST,
        "proxy/request-payment-token",
        {
            amount
        }
    )
}

export async function reauthenticate() {
    return await requestProxyJson(
        Method.GET,
        "proxy/reauthenticate"
    )
}

export async function cancelTokenRequest() {
    return await requestProxyJson(
        Method.GET,
        "proxy/cancel"
    )
}

let eventHandlerList: EventHandler[] = [];

export function registerEventHandler(handler: EventHandler) {
    if (eventHandlerList.indexOf(handler) >= 0) {
        return;
    }

    if (eventHandlerList.length == 0) {
        eventHandlerList.push(handler)

        connectEventSource();
    } else {
        eventHandlerList.push(handler)
    }
}

export function removeEventHandler(handler: EventHandler) {
    let index = eventHandlerList.indexOf(handler);
    if (index >= 0) {
        eventHandlerList.splice(index, 1);
    }

    if (eventHandlerList.length == 0) {
        disconnectEventSource();
    }
}

let evtSource: EventSource | null = null;
function connectEventSource() {
    if (evtSource) {
        return;
    }

    evtSource = new EventSource(BASE_URL + "proxy/events");

    evtSource.onmessage = (event) => {
        if (event.data === "connected" || event.data === "ping") {
            return;
        }
        
        try {
            let data = JSON.parse(event.data);
            parseEventMessage(data);
        } catch (e) {
            console.error("Cannot parse event message", e, event.data);
        }
    }

    evtSource.onopen = (_) => {
        for (let handler of eventHandlerList) {
            if (handler.onConnect) {
                handler.onConnect();
            }
        }
    }

    evtSource.onerror = (_) => {
        for (let handler of eventHandlerList) {
            if (handler.onDisconnect) {
                handler.onDisconnect();
            }
        }
        disconnectEventSource()
        setTimeout(() => {
            connectEventSource();
        }, 1000);
    }
}

function disconnectEventSource() {
    evtSource?.close();
    evtSource = null;
}

function parseEventMessage(data: any) {
    if (data && data.type) {
        switch (data.type) {
            case "account":
                for (let handler of eventHandlerList) {
                    if (handler.onAccountScanned) {
                        handler.onAccountScanned(data.content as Account);
                    }
                }
                break;
            case "product":
                for (let handler of eventHandlerList) {
                    if (handler.onProductScanned) {
                        handler.onProductScanned(data.content as Product);
                    }
                }
                break;
            case "qr-code":
                for (let handler of eventHandlerList) {
                    if (handler.onBarCodeScanned) {
                        handler.onBarCodeScanned(data.content.code as string);
                    }
                }
                break;
            case "nfc-card":
                for (let handler of eventHandlerList) {
                    if (handler.onNfcCardAdded) {
                        handler.onNfcCardAdded(data.content.id as string, data.content.writeable as boolean);
                    }
                }
                break;
            case "remove-nfc-card":
                for (let handler of eventHandlerList) {
                    if (handler.onNfcCardRemoved) {
                        handler.onNfcCardRemoved();
                    }
                }
                break;
            case "payment-token":
                for (let handler of eventHandlerList) {
                    if (handler.onPaymentTokenGenerated) {
                        handler.onPaymentTokenGenerated(data.content.token as string);
                    }
                }
                break;
            case "timeout":
                for (let handler of eventHandlerList) {
                    if (handler.onTimeout) {
                        handler.onTimeout();
                    }
                }
                break;
        }
    }
}
