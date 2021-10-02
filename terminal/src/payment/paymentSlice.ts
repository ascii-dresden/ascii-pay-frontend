import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PaymentStatus {
  Waiting,
  Success,
  Timeout,
  AuthenticationError,
  PaymentError,
}

export interface PaymentAccount {
  id: string;
  name: string;
  balance: number;
}

export interface PaymentDialogStatus {
  amount: number;
  status: PaymentStatus;
}

interface PaymentState {
  keypadValue: number;
  storedKeypadValues: number[];
  screensaver: boolean;
  scannedAccount: PaymentAccount | null;
  payment: PaymentDialogStatus | null;
}

const initialState: PaymentState = {
  keypadValue: 0,
  storedKeypadValues: [],
  screensaver: false,
  scannedAccount: null,
  payment: null,
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
    clearKeypadValue: (state) => {
      state.keypadValue = 0;
      state.storedKeypadValues = [];
    },
    setScreensaver: (state, action: PayloadAction<boolean>) => {
      state.screensaver = action.payload;
    },
    setAccount: (state, action: PayloadAction<PaymentAccount>) => {
      state.scannedAccount = action.payload;
    },
    removeAccount: (state) => {
      state.scannedAccount = null;
    },
    setPaymentDialog: (state, action: PayloadAction<PaymentStatus>) => {
      if (state.payment) return;

      const basketSum = state.storedKeypadValues.reduce((previous, current) => previous + current, 0);
      state.payment = {
        amount: basketSum,
        status: action.payload,
      };
    },
    updatePaymentDialog: (state, action: PayloadAction<PaymentStatus>) => {
      if (!state.payment) return;

      state.payment = {
        amount: state.payment.amount,
        status: action.payload,
      };
    },
    removePaymentDialog: (state) => {
      state.payment = null;
    },
  },
});

export const {
  setKeypadValue,
  submitKeypadValue,
  removeKeypadValue,
  clearKeypadValue,
  setScreensaver,
  setAccount,
  removeAccount,
  setPaymentDialog,
  updatePaymentDialog,
  removePaymentDialog,
} = paymentSlice.actions;
export default paymentSlice.reducer;
