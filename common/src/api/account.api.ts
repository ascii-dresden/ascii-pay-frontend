import { Account } from "../models";
import { requestJson, Method, requestText } from "./utils";

export async function listAccounts(search: string|null = null): Promise<Account[]> {
    return await requestJson(
        Method.GET,
        "accounts" + (search ? "?search=" + search : "")
    )
}

export async function createAccount(account: Account): Promise<string> {
    return await requestJson(
        Method.PUT,
        "accounts",
        account
    )
}

export async function getAccount(id: string): Promise<Account> {
    return await requestJson(
        Method.GET,
        "account/" + id
    )
}

export async function updateAccount(account: Account) {
    return await requestText(
        Method.POST,
        "account/" + account.id,
        account
    )
}

export async function deleteAccount(account: Account) {
    return await requestText(
        Method.DELETE,
        "account/" + account.id
    )
}

export async function addAccountBarcode(account: Account, barcode: string) {
    return await requestText(
        Method.PUT,
        "account/" + account.id + "/barcode",
        {
            barcode
        }
    )
}

export async function removeAccountBarcode(account: Account) {
    return await requestText(
        Method.DELETE,
        "account/" + account.id + "/barcode"
    )
}

export async function addAccountNfcTag(account: Account, nfc: string, writeable: boolean) {
    return await requestText(
        Method.PUT,
        "account/" + account.id + "/nfc",
        {
            nfc,
            writeable
        }
    )
}

export async function removeAccountNfcTag(account: Account) {
    return await requestText(
        Method.DELETE,
        "account/" + account.id + "/nfc"
    )
}
