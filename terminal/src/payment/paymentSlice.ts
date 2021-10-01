import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  keypadValue: number;
  storedKeypadValues: number[];
  screensaver: boolean;
}

const initialState: PaymentState = {
  keypadValue: 0,
  storedKeypadValues: [],
  screensaver: false,
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setKeypadValue: (state, action: PayloadAction<number>) => {
      state.keypadValue = action.payload;
    },
    submitKeypadValue: (state, action: PayloadAction<number>) => {
      state.keypadValue = 0;
      state.storedKeypadValues = state.storedKeypadValues.slice();
      state.storedKeypadValues.push(action.payload);
    },
    removeKeypadValue: (state, action: PayloadAction<number>) => {
      const index = state.storedKeypadValues.indexOf(action.payload);
      if (index >= 0) {
        state.storedKeypadValues = state.storedKeypadValues.slice();
        state.storedKeypadValues.splice(index, 1);
      }
    },
    setScreensaver: (state, action: PayloadAction<boolean>) => {
      state.screensaver = action.payload;
    },
  },
});

export const { setKeypadValue, submitKeypadValue, removeKeypadValue, setScreensaver } = paymentSlice.actions;
export default paymentSlice.reducer;
