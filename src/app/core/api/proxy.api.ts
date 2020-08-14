import { requestJson, Method, BASE_URL } from "./utils";
import { Product, Account } from "../models";

export interface EventHandler {
    onConnect(): any;
    onDisconnect(): any;

    onAccountScanned(account: Account): any;
    onProductScanned(product: Product): any;
    onBarCodeScanned(code: String): any;
    onNfcCardAdded(id: String, writeable: boolean): any;
    onNfcCardRemoved(): any;
    onPaymentTokenGenerated(token: String): any;
    onTimeout(): any;
}

export async function requestPaymentToken(amount: number) {
    return await requestJson(
        Method.POST,
        "/request-payment-token",
        {
            amount
        }
    )
}

export async function reauthenticate() {
    return await requestJson(
        Method.GET,
        "/reauthenticate"
    )
}

let eventHandlerList: EventHandler[] = [];

export function registerEventHandler(handler: EventHandler) {
    if (eventHandlerList.length == 0) {
        eventHandlerList.push(handler)

        connectEventSource();
    } else {
        eventHandlerList.push(handler)
    }
}

function connectEventSource() {
    const evtSource = new EventSource(BASE_URL + "/events");
    evtSource.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data);
            parseEventMessage(data);
        } catch (e) {
            console.error("Cannot parse event message", e);
        }
    }

    evtSource.onopen = (_) => {
        for (let handler of eventHandlerList) {
            handler.onConnect();
        }
    }

    evtSource.onerror = (event) => {
        console.error("Connection to event source lost!", event);
        for (let handler of eventHandlerList) {
            handler.onDisconnect();
        }
        connectEventSource();
    }

}

function parseEventMessage(data: any) {
    if (data && data.type) {
        switch (data.type) {
            case "account":
                for (let handler of eventHandlerList) {
                    handler.onAccountScanned(data.content as Account);
                }
                break;
            case "product":
                for (let handler of eventHandlerList) {
                    handler.onProductScanned(data.content as Product);
                }
                break;
            case "qr-code":
                for (let handler of eventHandlerList) {
                    handler.onBarCodeScanned(data.content.code as String);
                }
                break;
            case "nfc-card":
                for (let handler of eventHandlerList) {
                    handler.onNfcCardAdded(data.content.id as String, data.content.writeable as boolean);
                }
                break;
            case "remove-nfc-card":
                for (let handler of eventHandlerList) {
                    handler.onNfcCardRemoved();
                }
                break;
            case "payment-token":
                for (let handler of eventHandlerList) {
                    handler.onPaymentTokenGenerated(data.content.token as String);
                }
                break;
            case "timeout":
                for (let handler of eventHandlerList) {
                    handler.onTimeout();
                }
                break;
        }
    }
}
