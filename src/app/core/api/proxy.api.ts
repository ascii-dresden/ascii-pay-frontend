import { requestJson, Method } from "./utils";

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
