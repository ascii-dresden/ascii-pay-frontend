import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { productApi } from "./api/productApi";
import { accountApi } from "./api/accountApi";
import accountReducer from "./features/accountSlice";
import terminalReducer from "./features/terminalSlice";
import registerReducer from "./features/registerSlice";
import paymentReducer from "./features/paymentSlice";

export const terminalStore = configureStore({
  reducer: {
    [accountApi.reducerPath]: accountApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    accountState: accountReducer,
    terminalState: terminalReducer,
    registerState: registerReducer,
    paymentState: paymentReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      accountApi.middleware,
      productApi.middleware,
    ]),
});

export type TerminalState = ReturnType<typeof terminalStore.getState>;
export type TerminalDispatch = typeof terminalStore.dispatch;
export const useTerminalDispatch = () => useDispatch<TerminalDispatch>();
export const useTerminalSelector: TypedUseSelectorHook<TerminalState> =
  useSelector;
