import { ApolloClient } from '@apollo/client';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GET_ACCOUNT_BY_ACCESS_TOKEN, TRANSACTION } from '../graphql';
import { AppDispatch, RootState } from '../store';
import { getAccountByAccessToken, getAccountByAccessTokenVariables } from '../__generated__/getAccountByAccessToken';
import { transaction, transactionVariables } from '../__generated__/transaction';

export interface PaymentAccount {
  id: string;
  name: string;
  credit: number;
}
export interface PaymentProduct {
  id: string;
  name: string;
  image: string | null;
  currentPrice: number;
}

export interface PaymentPaymentWaiting {
  type: 'Waiting';
  timeout: number;
  amount: number;
  products: {
    product: PaymentProduct;
    amount: number;
  }[];
}
export interface PaymentPaymentInProgress {
  type: 'InProgress';
  timeout: number;
  amount: number;
  products: {
    product: PaymentProduct;
    amount: number;
  }[];
}
export interface PaymentPaymentError {
  type: 'Error';
  timeout: number;
  amount: number;
  message: string;
}
export interface PaymentPaymentSuccess {
  type: 'Success';
  timeout: number;
  amount: number;
}
export type PaymentPayment =
  | PaymentPaymentWaiting
  | PaymentPaymentInProgress
  | PaymentPaymentError
  | PaymentPaymentSuccess;

interface PaymentState {
  screensaver: boolean;
  screensaverTimeout: number;
  keypadValue: number;
  storedKeypadValues: number[];
  storedProducts: {
    product: PaymentProduct;
    amount: number;
  }[];
  scannedAccount: PaymentAccount | null;
  payment: PaymentPayment | null;
}

const initialState: PaymentState = {
  screensaver: true,
  screensaverTimeout: 0,
  keypadValue: 0,
  storedKeypadValues: [],
  storedProducts: [],
  scannedAccount: null,
  payment: null,
};

const SCREENSAVER_TIMEOUT = 300_000;
const PAYMENT_WAITING_TIMEOUT = 30_000;
const PAYMENT_INPROGRESS_TIMEOUT = 3_000;
const PAYMENT_ERROR_TIMEOUT = 5_000;
const PAYMENT_SUCCESS_TIMEOUT = 2_000;

export const receiveAccountAccessToken = createAsyncThunk<
  {
    account: PaymentAccount | null;
    payment?: PaymentPayment;
  },
  {
    apollo: ApolloClient<object>;
    accessToken: string;
  },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('payment/receiveAccessToken', async (query, thunkApi) => {
  const state = thunkApi.getState().payment;

  if (state.payment && state.payment.type === 'InProgress') {
    const payment = state.payment;
    const variables: transactionVariables = {
      accountAccessToken: query.accessToken,
      amount: -state.payment.amount,
      products: state.payment.products.map(({ product, amount }) => {
        return {
          id: product.id,
          amount: amount,
        };
      }),
    };

    let result = await query.apollo.mutate<transaction, transactionVariables>({
      mutation: TRANSACTION,
      variables,
    });

    if (result.errors || !result.data) {
      return {
        account: null,
        payment: {
          type: 'Error',
          message: 'Could not execute transaction!',
          timeout: Date.now() + PAYMENT_ERROR_TIMEOUT,
          amount: payment.amount,
        },
      };
    } else {
      let data = result.data;
      return {
        account: {
          id: data.transaction.account.id,
          name: data.transaction.account.name,
          credit: data.transaction.account.credit,
        },
        payment: {
          type: 'Success',
          timeout: Date.now() + PAYMENT_SUCCESS_TIMEOUT,
          amount: payment.amount,
        },
      };
    }
  } else {
    const variables: getAccountByAccessTokenVariables = {
      accountAccessToken: query.accessToken,
    };
    let result = await query.apollo.query<getAccountByAccessToken, getAccountByAccessTokenVariables>({
      query: GET_ACCOUNT_BY_ACCESS_TOKEN,
      variables,
    });
    if (result.errors || !result.data) {
      return {
        account: null,
      };
    } else {
      let data = result.data;
      return {
        account: {
          id: data.getAccountByAccessToken.id,
          name: data.getAccountByAccessToken.name,
          credit: data.getAccountByAccessToken.credit,
        },
      };
    }
  }
});

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
    addProduct: (state, action: PayloadAction<PaymentProduct>) => {
      const list = state.storedProducts.slice();
      const index = list.findIndex((x) => x.product.id === action.payload.id);

      if (index >= 0) {
        list[index].amount += 1;
      } else {
        list.push({
          product: action.payload,
          amount: 1,
        });
      }
      state.storedProducts = list;
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.storedProducts = state.storedProducts.slice();
      const index = state.storedProducts.findIndex((x) => x.product.id === action.payload);

      if (index >= 0) {
        let amount = state.storedProducts[index].amount;
        if (amount > 1) {
          state.storedProducts[index].amount -= 1;
        } else {
          state.storedProducts.splice(index, 1);
        }
      }
    },
    setScreensaver: (state, action: PayloadAction<boolean>) => {
      state.screensaver = action.payload;
      if (!action.payload) {
        state.screensaverTimeout = Date.now() + SCREENSAVER_TIMEOUT;
      }
    },
    removeAccount: (state) => {
      state.scannedAccount = null;
    },
    payment: (state) => {
      if (state.payment) return;
      const products = state.storedProducts;
      const basketSum =
        state.storedKeypadValues.reduce((previous, current) => previous + current, 0) +
        products.reduce((previous, current) => previous + current.product.currentPrice * current.amount, 0);

      state.payment = {
        type: 'Waiting',
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        amount: basketSum,
        products: products,
      };
    },
    cancelPayment: (state) => {
      state.payment = null;
    },
    checkTimeouts: (state) => {
      const now = Date.now();

      if (!state.screensaver && state.screensaverTimeout < now) {
        state.screensaver = true;
      }

      if (state.payment && state.payment.timeout < now) {
        state.payment = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(receiveAccountAccessToken.fulfilled, (state, action) => {
      state.scannedAccount = action.payload.account;

      if (action.payload.payment) {
        state.payment = action.payload.payment;

        if (state.payment.type === 'Success') {
          state.keypadValue = 0;
          state.storedKeypadValues = [];
          state.storedProducts = [];
        }
      }
    });
    builder.addCase(receiveAccountAccessToken.pending, (state) => {
      if (state.payment?.type === 'Waiting') {
        state.payment = {
          type: 'InProgress',
          timeout: Date.now() + PAYMENT_INPROGRESS_TIMEOUT,
          amount: state.payment.amount,
          products: state.storedProducts,
        };
      }
    });
  },
});

export const {
  setKeypadValue,
  submitKeypadValue,
  removeKeypadValue,
  clearKeypadValue,
  addProduct,
  removeProduct,
  setScreensaver,
  removeAccount,
  payment,
  cancelPayment,
  checkTimeouts,
} = paymentSlice.actions;
export default paymentSlice.reducer;
