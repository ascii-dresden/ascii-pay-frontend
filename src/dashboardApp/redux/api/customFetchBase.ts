import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { DashboardState } from "../dashboardStore";

export const BASE_URL = `${window.origin}/api/v1`;

export const customFetchBase = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as DashboardState).userState.token;
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
