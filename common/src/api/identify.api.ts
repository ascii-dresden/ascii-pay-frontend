import { Account, Product } from '../models';
import { requestJson, Method } from './utils';

type IdentifyRequestBarCode = {
  type: 'barcode';
  code: string;
};

type IdentifyRequestNfc = {
  type: 'nfc';
  id: string;
};

type IdentifyRequestNfcSecure = {
  type: 'nfc-secure';
  id: string;
  challenge: string;
  response: string;
};

type IdentifyRequest = IdentifyRequestBarCode | IdentifyRequestNfc | IdentifyRequestNfcSecure;

type IdentifyResponseAccount = {
  type: 'account';
  account: Account;
};

type IdentifyResponseProduct = {
  type: 'product';
  product: Product;
};

type IdentifyResponseChallengeResponse = {
  type: 'authentication-needed';
  id: string;
  key: string;
  challenge: string;
};

type IdentifyResponseWriteKey = {
  type: 'write-key';
  id: string;
  key: string;
  secret: string;
};

type IdentifyResponse =
  | IdentifyResponseAccount
  | IdentifyResponseProduct
  | IdentifyResponseChallengeResponse
  | IdentifyResponseWriteKey;

export async function identify(request: IdentifyRequest): Promise<IdentifyResponse> {
  return await requestJson(Method.POST, 'identify', request);
}
