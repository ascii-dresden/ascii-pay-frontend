import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  AccountDto,
  CreateAdminAccountDto,
  PaymentDto,
  SaveAccountDto,
  TransactionDto,
} from "./contracts";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: customFetchBase,
  tagTypes: ["Accounts", "Transactions"],
  endpoints: (builder) => ({
    createAccount: builder.mutation<AccountDto, SaveAccountDto>({
      query(account) {
        return {
          url: "/accounts",
          method: "POST",
          credentials: "include",
          body: account,
        };
      },
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
    }),
    updateAccount: builder.mutation<
      AccountDto,
      { id: number; account: SaveAccountDto }
    >({
      query({ id, account }) {
        return {
          url: `/account/${id}`,
          method: "PUT",
          credentials: "include",
          body: account,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Accounts", id },
              { type: "Accounts", id: "LIST" },
            ]
          : [{ type: "Accounts", id: "LIST" }],
    }),
    getAccount: builder.query<AccountDto, number>({
      query(id) {
        return {
          url: `/account/${id}`,
          credentials: "include",
        };
      },
      providesTags: (result, error, id) => [{ type: "Accounts", id }],
    }),
    getAllAccounts: builder.query<AccountDto[], void>({
      query() {
        return {
          url: `/accounts`,
          credentials: "include",
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
    deleteAccount: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/account/${id}`,
          method: "DELETE",
          credentials: "include",
        };
      },
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
    }),
    payment: builder.mutation<
      TransactionDto,
      { id: number; payment: PaymentDto }
    >({
      query({ id, payment }) {
        return {
          url: `/account/${id}/payment`,
          method: "POST",
          credentials: "include",
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
          credentials: "include",
        };
      },
      providesTags: [{ type: "Transactions", id: "LIST" }],
    }),
    createAdminAccount: builder.mutation<AccountDto, CreateAdminAccountDto>({
      query(account) {
        return {
          url: "/create-admin-account",
          method: "POST",
          credentials: "include",
          body: account,
        };
      },
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useUpdateAccountMutation,
  useGetAllAccountsQuery,
  useGetAccountQuery,
  useCreateAdminAccountMutation,
  usePaymentMutation,
  useGetAllTransactionsQuery,
} = accountApi;
