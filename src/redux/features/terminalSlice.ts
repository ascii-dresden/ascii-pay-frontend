import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const SCREENSAVER_TIMEOUT = 300_000;
type PaymentState = {
  screensaver: boolean;
  screensaverTimeout: number;
};
const initialState: PaymentState = {
  screensaver: false,
  screensaverTimeout: 0,
};
export const terminalSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setScreensaver: (state, action: PayloadAction<boolean>) => {
      state.screensaver = action.payload;
      if (!action.payload) {
        state.screensaverTimeout = Date.now() + SCREENSAVER_TIMEOUT;
      }
    },
    checkTimeouts: (state) => {
      const now = Date.now();

      if (!state.screensaver && state.screensaverTimeout < now) {
        state.screensaver = true;
      }
    },
  },
});

export const { setScreensaver, checkTimeouts } = terminalSlice.actions;
export default terminalSlice.reducer;
