import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import {
  AccountStatusDto,
  SaveAccountStatusDto,
} from "../../../common/contracts";

export const accountStatusApi = createApi({
  reducerPath: "accountStatusApi",
  baseQuery: customFetchBase,
  tagTypes: ["AccountStatus"],
  endpoints: (builder) => ({
    createAccountStatus: builder.mutation<
      AccountStatusDto,
      SaveAccountStatusDto
    >({
      query(accountStatus) {
        return {
          url: "/accountStatus",
          method: "POST",
          body: accountStatus,
        };
      },
      invalidatesTags: [{ type: "AccountStatus", id: "LIST" }],
    }),
    updateAccountStatus: builder.mutation<
      AccountStatusDto,
      { id: number; accountStatus: SaveAccountStatusDto }
    >({
      query({ id, accountStatus }) {
        return {
          url: `/accountStatus/${id}`,
          method: "PUT",
          body: accountStatus,
        };
      },
      invalidatesTags: (result, error, { id }) =>
        result
          ? [
              { type: "AccountStatus", id },
              { type: "AccountStatus", id: "LIST" },
            ]
          : [{ type: "AccountStatus", id: "LIST" }],
    }),
    getAccountStatus: builder.query<AccountStatusDto, number>({
      query(id) {
        return {
          url: `/accountStatus/${id}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "AccountStatus", id }],
    }),
    getAllAccountStatus: builder.query<AccountStatusDto[], void>({
      query() {
        return {
          url: `/accountStatus`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AccountStatus" as const,
                id,
              })),
              { type: "AccountStatus", id: "LIST" },
            ]
          : [{ type: "AccountStatus", id: "LIST" }],
    }),
    deleteAccountStatus: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/accountStatus/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "AccountStatus", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateAccountStatusMutation,
  useDeleteAccountStatusMutation,
  useUpdateAccountStatusMutation,
  useGetAllAccountStatusQuery,
  useGetAccountStatusQuery,
} = accountStatusApi;
