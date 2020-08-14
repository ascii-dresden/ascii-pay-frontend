export const BASE_URL = "https://ascii.pixix4.com/"
export const API_PATH = "api/v1/"
export const API_URL = BASE_URL + API_PATH


export enum Method {
    GET, PUT, POST, DELETE
}

export async function requestJson<T>(
    method: Method,
    url: string,
    body: any = null
): Promise<T> {
    var params: RequestInit = {
        method: Method[method],
        cache: 'no-cache',
        headers: {
            Accept: 'application/json'
        }
    };

    if (body) {
        params.body = JSON.stringify(body);
        params.headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
    }

    let requestUrl;

    if (url.startsWith("/")) {
        requestUrl = url;
    } else {
        requestUrl = API_URL + url
    }

    let response = await fetch(requestUrl, params);
    return await response.json() as T;
}