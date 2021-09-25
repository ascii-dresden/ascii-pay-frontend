import { Account } from '../models';
import { requestJson, Method } from './utils';

export async function getAuth(id: string): Promise<Account> {
  return await requestJson(Method.GET, 'auth');
}

export async function login(username: string, password: string) {
  return await requestJson(Method.POST, 'auth', {
    username,
    password,
  });
}

export async function logout(account: Account) {
  return await requestJson(Method.DELETE, 'auth');
}
