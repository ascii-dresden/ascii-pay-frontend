import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  AccountDto,
  CreateAdminAccountDto,
  DeleteAuthNfcDto,
  PasswordResetTokenDto,
  PaymentDto,
  SaveAccountDto,
  SaveAuthPasswordDto,
  SessionDto,
  TransactionDto,
} from "../../../common/contracts";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: customFetchBase,
  tagTypes: ["Accounts", "Transactions", "Sessions"],
  endpoints: (builder) => ({
    createAccount: builder.mutation<AccountDto, SaveAccountDto>({
      query(account) {
        return {
          url: "/accounts",
          method: "POST",
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
    deleteAccount: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/account/${id}`,
          method: "DELETE",
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
          body: payment,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "Accounts", id },
              { type: "Accounts", id: "LIST" },
              { type: "Transactions", id },
              { type: "Transactions", id: "GLOBAL" },
            ]
          : [
              { type: "Accounts", id: "LIST" },
              { type: "Transactions", id: "GLOBAL" },
            ],
    }),
    getAllTransactions: builder.query<TransactionDto[], number>({
      query(id) {
        return {
          url: `/account/${id}/transactions`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Transactions", id }],
    }),
    getGlobalTransactions: builder.query<TransactionDto[], void>({
      query() {
        return {
          url: `/transactions`,
        };
      },
      providesTags: [{ type: "Transactions", id: "GLOBAL" }],
    }),
    createAdminAccount: builder.mutation<AccountDto, CreateAdminAccountDto>({
      query(account) {
        return {
          url: "/create-admin-account",
          method: "POST",
          body: account,
        };
      },
      invalidatesTags: [{ type: "Accounts", id: "LIST" }],
    }),
    updateAccountPasswordAuthentication: builder.mutation<
      AccountDto,
      { id: number; auth: SaveAuthPasswordDto }
    >({
      query({ id, auth }) {
        return {
          url: `/account/${id}/password-authentication`,
          method: "PUT",
          body: auth,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: "Accounts", id }] : [],
    }),
    deleteAccountPasswordAuthentication: builder.mutation<AccountDto, number>({
      query(id) {
        return {
          url: `/account/${id}/password-authentication`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) =>
        result ? [{ type: "Accounts", id }] : [],
    }),
    createAccountPasswordResetToken: builder.mutation<
      PasswordResetTokenDto,
      number
    >({
      query(id) {
        return {
          url: `/account/${id}/password-reset-token`,
          method: "POST",
        };
      },
      invalidatesTags: (result, error, id) =>
        result ? [{ type: "Accounts", id }] : [],
    }),
    accountPasswordReset: builder.mutation<
      AccountDto,
      { token: string; auth: SaveAuthPasswordDto }
    >({
      query({ token, auth }) {
        return {
          url: `/account-password-reset`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: auth,
        };
      },
      invalidatesTags: (result) =>
        result ? [{ type: "Accounts", id: result.id }] : [],
    }),
    updateAccountPublicTabAuthentication: builder.mutation<AccountDto, number>({
      query(id) {
        return {
          url: `/account/${id}/public-tab`,
          method: "PUT",
        };
      },
      invalidatesTags: (result, error, id) =>
        result ? [{ type: "Accounts", id }] : [],
    }),
    deleteAccountPublicTabAuthentication: builder.mutation<AccountDto, number>({
      query(id) {
        return {
          url: `/account/${id}/public-tab`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) =>
        result ? [{ type: "Accounts", id }] : [],
    }),
    deleteAccountNfcAuthentication: builder.mutation<
      AccountDto,
      { id: number; auth: DeleteAuthNfcDto }
    >({
      query({ id, auth }) {
        return {
          url: `/account/${id}/nfc-authentication`,
          method: "DELETE",
          body: auth,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: "Accounts", id }] : [],
    }),
    getAllAccountSessions: builder.query<SessionDto[], number>({
      query(id) {
        return {
          url: `/account/${id}/sessions`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Sessions", id }],
    }),
    deleteAccountSession: builder.mutation<
      SessionDto[],
      { id: number; session: SessionDto }
    >({
      query({ id, session }) {
        return {
          url: `/account/${id}/sessions`,
          method: "DELETE",
          body: session,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: "Sessions", id }] : [],
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
  useGetGlobalTransactionsQuery,
  useUpdateAccountPasswordAuthenticationMutation,
  useDeleteAccountPasswordAuthenticationMutation,
  useCreateAccountPasswordResetTokenMutation,
  useAccountPasswordResetMutation,
  useUpdateAccountPublicTabAuthenticationMutation,
  useDeleteAccountPublicTabAuthenticationMutation,
  useDeleteAccountNfcAuthenticationMutation,
  useLazyGetAllAccountSessionsQuery,
  useDeleteAccountSessionMutation,
} = accountApi;
