import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { TerminalState } from "../terminalStore";

// export const BASE_URL = `${window.origin}/api/v1`;
export const BASE_URL = `http://localhost:3000/api/v1`;

export const customFetchBase = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as TerminalState).accountState.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
