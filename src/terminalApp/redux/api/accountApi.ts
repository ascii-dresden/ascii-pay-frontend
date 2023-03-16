import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  AccountDto,
  PaymentDto,
  TransactionDto,
} from "../../../common/contracts";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: customFetchBase,
  tagTypes: ["Accounts", "Transactions", "Sessions"],
  endpoints: (builder) => ({
    getAccount: builder.query<AccountDto, number>({
      query(id) {
        return {
          url: `/account/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Accounts", id }],
    }),
    getAllAccounts: builder.query<AccountDto[], void>({
      query() {
        return {
          url: `/accounts`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Accounts" as const,
                id,
              })),
              { type: "Accounts", id: "LIST" },
            ]
          : [{ type: "Accounts", id: "LIST" }],
    }),
    payment: builder.mutation<
      TransactionDto,
      { id: number; payment: PaymentDto }
    >({
      query({ id, payment }) {
        return {
          url: `/account/${id}/payment`,
          method: "POST",
          body: payment,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Accounts", id },
              { type: "Accounts", id: "LIST" },
              { type: "Transactions", id: "LIST" },
            ]
          : [
              { type: "Accounts", id: "LIST" },
              { type: "Transactions", id: "LIST" },
            ],
    }),
    getAllTransactions: builder.query<TransactionDto[], number>({
      query(id) {
        return {
          url: `/account/${id}/transactions`,
        };
      },
      providesTags: [{ type: "Transactions", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllAccountsQuery,
  useGetAccountQuery,
  usePaymentMutation,
  useGetAllTransactionsQuery,
} = accountApi;
