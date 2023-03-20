import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { TerminalState } from "../terminalStore";
import { BASE_URL } from "../../../const";

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
