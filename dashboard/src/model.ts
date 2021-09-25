export type AccountOutput = {
  id: string;
  credit: number;
  minimumCredit: number;
  name: string;
  mail: string;
  username: string;
  accountNumber: string;
  permission: string;
  receivesMonthlyReport: boolean;
  allowNfcRegistration: boolean;
};

export type TransactionOutput = {
  id: string;
  total: number;
  beforeCredit: number;
  afterCredit: number;
  date: string;
  products: {
    product: {
      id: string;
      name: string;
      currentPrice: number;
    };
    amount: number;
  }[];
};
