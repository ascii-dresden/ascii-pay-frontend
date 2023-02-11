import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountDto } from "../api/contracts";

interface UserState {
  user: AccountDto | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    logout: () => initialState,
    setUser: (state, action: PayloadAction<AccountDto>) => {
      state.user = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { logout, setUser } = userSlice.actions;
