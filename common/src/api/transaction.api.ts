import { Account, Product, Transaction } from '../models';
import { requestJson, Method } from './utils';

type TokenRequestBarCode = {
  type: 'barcode';
  code: string;
};

type TokenRequestNfc = {
  type: 'nfc';
  id: string;
};

type TokenRequestNfcSecure = {
  type: 'nfc-secure';
  id: string;
  challenge: string;
  response: string;
};

type TokenRequest = TokenRequestBarCode | TokenRequestNfc | TokenRequestNfcSecure;

type TokenResponseSuccess = {
  type: 'authorized';
  token: string;
};

type TokenResponseChallengeResponse = {
  type: 'authentication-needed';
  id: string;
  key: string;
  challenge: string;
};

type TokenResponse = TokenResponseSuccess | TokenResponseChallengeResponse;

type PaymentResponse = {
  account: Account;
  transaction: Transaction;
};

export async function requestToken(amount: number, method: TokenRequest): Promise<TokenResponse> {
  return await requestJson(Method.POST, 'transaction/token', {
    amount,
    method,
  });
}

export async function payment(amount: number, token: string, products: Map<Product, number>): Promise<PaymentResponse> {
  let productMap: any = {};

  for (let [product, count] of products.entries()) {
    productMap[product.id] = count;
  }

  return await requestJson(Method.POST, 'transaction/payment', {
    amount,
    token,
    products: productMap,
  });
}
