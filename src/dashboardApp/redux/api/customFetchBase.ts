import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { DashboardState } from "../dashboardStore";
import { logout } from "../features/userSlice";

// export const BASE_URL = `${window.origin}/api/v1`;
export const BASE_URL = `http://localhost:3000/api/v1`;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as DashboardState).userState.token;
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const token = (api.getState() as DashboardState).userState.token;

    if (token) {
      api.dispatch(logout());
    }
  }

  return result;
};
