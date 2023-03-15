import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { productApi } from "./api/productApi";
import { accountApi } from "./api/accountApi";
import userReducer from "./features/userSlice";

export const dashboardStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    userState: userReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      accountApi.middleware,
      productApi.middleware,
    ]),
});

export type DashboardState = ReturnType<typeof dashboardStore.getState>;
export type DashboardDispatch = typeof dashboardStore.dispatch;
export const useDashboardDispatch = () => useDispatch<DashboardDispatch>();
export const useDashboardSelector: TypedUseSelectorHook<DashboardState> =
  useSelector;