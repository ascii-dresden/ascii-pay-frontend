import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../store";

export const BASE_URL = `${window.origin}/api/v1`;

export const customFetchBase = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).userState.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
