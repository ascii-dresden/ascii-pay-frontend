import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AccountDto } from "../../../common/contracts";
import { BASE_URL } from "../../../const";

interface UserState {
  token: string | null;
  account: AccountDto | null;
}

const initialState: UserState = {
  token: null,
  account: null,
};

export const terminalLogin = createAsyncThunk<
  {
    account: AccountDto | null;
    token: string;
  },
  string
>("account/terminalLogin", async (query) => {
  try {
    let response = await fetch(`${BASE_URL}/auth/account`, {
      method: "GET",
      credentials: "omit",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${query}`,
      },
    });
    let account = (await response.json()) as AccountDto | null;
    if (!account?.id) {
      account = null;
    }

    return {
      account,
      token: query,
    };
  } catch {
    return {
      account: null,
      token: query,
    };
  }
});

export const accountSlice = createSlice({
  initialState,
  name: "accountSlice",
  reducers: {
    terminalLogout: () => {
      return { token: null, account: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(terminalLogin.fulfilled, (state, action) => {
      state.account = action.payload.account;
      state.token = action.payload.token;
    });
  },
});

export default accountSlice.reducer;

export const { terminalLogout } = accountSlice.actions;
