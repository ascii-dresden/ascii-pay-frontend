export interface Transaction {
  readonly id: string;
  account_id: string;
  cashier_id?: string;
  total: number;
  date: string;
}
