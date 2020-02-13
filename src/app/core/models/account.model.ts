import { Permission } from './permission.type';

export interface Account {
  readonly id: string;
  credit: number;
  minimum_credit: number;
  name: string;
  mail: string;
  username: string;
  account_number: string;
  permission: Permission;
}
