import { createApi } from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase";
import { AccountDto, CreateAdminAccountDto, SaveAccountDto } from "./contracts";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: customFetchBase,
  tagTypes: ["Accounts"],
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
  useCreateAdminAccountMutation,
} = accountApi;
