import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import { userApi } from "./userApi";
import { AuthPasswordBasedDto, AuthTokenDto } from "./contracts";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthTokenDto, AuthPasswordBasedDto>({
      query(data) {
        return {
          url: "auth/password",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {}
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: "auth",
          method: "DELETE",
          credentials: "include",
        };
      },
    }),
  }),
});

export const { useLoginUserMutation, useLogoutUserMutation } = authApi;
