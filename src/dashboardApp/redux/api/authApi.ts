import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBase } from "./customFetchBase";
import { AuthPasswordBasedDto, AuthTokenDto } from "../../../common/contracts";
import { setToken } from "../features/userSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthTokenDto, AuthPasswordBasedDto>({
      query(data) {
        const url = data.longLived
          ? "auth/password?long_lived=true"
          : "auth/password";
        return {
          url,
          method: "POST",
          body: {
            username: data.username,
            password: data.password,
          },
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.token ?? null));
        } catch (error) {}
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: "auth",
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useLoginUserMutation, useLogoutUserMutation } = authApi;
