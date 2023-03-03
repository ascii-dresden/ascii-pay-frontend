import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountDto } from "../api/contracts";

interface UserState {
  token: string | null;
  user: AccountDto | null;
}

const initialState: UserState = {
  token: window.localStorage.getItem("ascii-pay-session-token"),
  user: null,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    logout: () => {
      window.localStorage.removeItem("ascii-pay-session-token");
      return { token: null, user: null };
    },
    setToken: (state, action: PayloadAction<string>) => {
      window.localStorage.setItem("ascii-pay-session-token", action.payload);
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<AccountDto>) => {
      state.user = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { logout, setUser, setToken } = userSlice.actions;
