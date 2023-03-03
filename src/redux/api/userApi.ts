import { createApi } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/userSlice";
import { customFetchBase } from "./customFetchBase";
import { AccountDto } from "./contracts";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customFetchBase,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<AccountDto, string | null>({
      query() {
        return {
          url: "auth/account",
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const { useGetMeQuery } = userApi;
