import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { productApi } from "./api/productApi";
import { accountApi } from "./api/accountApi";
import userReducer from "./features/userSlice";
import terminalReducer from "./features/terminalSlice";
import registerReducer from "./features/registerSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    userState: userReducer,
    terminalState: terminalReducer,
    registerState: registerReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
