import { ApolloClient } from '@apollo/client';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GET_ACCOUNT_BY_ACCESS_TOKEN, TRANSACTION } from '../graphql';
import { AppDispatch, RootState } from '../store';
import { StampType } from '../types/graphql-global';
import { getAccountByAccessToken, getAccountByAccessTokenVariables } from '../__generated__/getAccountByAccessToken';
import { transaction, transactionVariables } from '../__generated__/transaction';

export interface PaymentAccount {
  id: UUID;
  name: string;
  credit: number;
  coffeeStamps: number;
  bottleStamps: number;
}
export interface PaymentProduct {
  id: UUID;
  name: string;
  image: string | null;
  price: number;
  payWithStamps: StampType;
  giveStamps: StampType;
}
export interface PaymentItem {
  price: number;
  payWithStamps: StampType;
  giveStamps: StampType;
  product: PaymentProduct | null;
}

export interface PaymentPaymentWaiting {
  type: 'Waiting';
  timeout: number;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  items: PaymentItem[];
}
export interface PaymentPaymentInProgress {
  type: 'InProgress';
  timeout: number;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  items: PaymentItem[];
}
export interface PaymentPaymentError {
  type: 'Error';
  timeout: number;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  message: string;
}
export interface PaymentPaymentSuccess {
  type: 'Success';
  timeout: number;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
}
export type PaymentPayment =
  | PaymentPaymentWaiting
  | PaymentPaymentInProgress
  | PaymentPaymentError
  | PaymentPaymentSuccess;

export enum NotificationType {
  GENERAL,
  NFC,
  QR,
}
export enum NotificationColor {
  INFO,
  WARN,
  ERROR,
}
export interface Notification {
  type: NotificationType;
  color: NotificationColor;
  title: string;
  description: string;
  timeout: number;
}

interface PaymentState {
  screensaver: boolean;
  screensaverTimeout: number;
  keypadValue: number;
  storedPaymentItems: PaymentItem[];
  scannedAccount: PaymentAccount | null;
  paymentTotal: number;
  paymentCoffeeStamps: number;
  paymentBottleStamps: number;
  payment: PaymentPayment | null;
  notifications: Notification[];
}

const initialState: PaymentState = {
  screensaver: true,
  screensaverTimeout: 0,
  keypadValue: 0,
  storedPaymentItems: [],
  scannedAccount: null,
  paymentTotal: 0,
  paymentCoffeeStamps: 0,
  paymentBottleStamps: 0,
  payment: null,
  notifications: [],
};

const SCREENSAVER_TIMEOUT = 300_000;
const NOTIFICATION_TIMEOUT = 5_000;
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
      stopIfStampPaymentIsPossible: false,
      transactionItems: state.payment.items.map((i) => {
        return {
          price: i.price,
          payWithStamps: i.payWithStamps,
          giveStamps: i.giveStamps,
          productId: i.product?.id,
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
          total: payment.total,
          coffeeStamps: payment.coffeeStamps,
          bottleStamps: payment.bottleStamps,
        },
      };
    } else {
      let data = result.data;
      return {
        account: {
          id: data.transaction.account.id,
          name: data.transaction.account.name,
          credit: data.transaction.account.credit,
          coffeeStamps: data.transaction.account.coffeeStamps,
          bottleStamps: data.transaction.account.bottleStamps,
        },
        payment: {
          type: 'Success',
          timeout: Date.now() + PAYMENT_SUCCESS_TIMEOUT,
          total: payment.total,
          coffeeStamps: payment.coffeeStamps,
          bottleStamps: payment.bottleStamps,
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
          coffeeStamps: data.getAccountByAccessToken.coffeeStamps,
          bottleStamps: data.getAccountByAccessToken.bottleStamps,
        },
      };
    }
  }
});

function trimPrefix(str: string, prefix: string) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  } else {
    return str;
  }
}

function calculateTotal(storedPaymentItems: PaymentItem[]) {
  const total = storedPaymentItems.reduce((previous, current) => previous + current.price, 0);
  const coffeeStamps = storedPaymentItems.reduce((previous, current) => {
    if (current.payWithStamps === StampType.COFFEE) {
      return previous - 10;
    } else if (current.giveStamps === StampType.COFFEE) {
      return previous + 1;
    } else {
      return previous;
    }
  }, 0);
  const bottleStamps = storedPaymentItems.reduce((previous, current) => {
    if (current.payWithStamps === StampType.BOTTLE) {
      return previous - 10;
    } else if (current.giveStamps === StampType.BOTTLE) {
      return previous + 1;
    } else {
      return previous;
    }
  }, 0);

  return {
    total,
    coffeeStamps,
    bottleStamps,
  };
}

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setKeypadValue: (state, action: PayloadAction<number>) => {
      state.keypadValue = action.payload;
    },
    submitKeypadValue: (state, action: PayloadAction<number>) => {
      state.keypadValue = 0;
      const items = state.storedPaymentItems.slice();
      items.push({
        price: action.payload,
        payWithStamps: StampType.NONE,
        giveStamps: StampType.NONE,
        product: null,
      });
      state.storedPaymentItems = items;

      const total = calculateTotal(items);
      state.paymentTotal = total.total;
      state.paymentCoffeeStamps = total.coffeeStamps;
      state.paymentBottleStamps = total.bottleStamps;
    },
    addProduct: (state, action: PayloadAction<PaymentProduct>) => {
      const items = state.storedPaymentItems.slice();
      items.push({
        price: action.payload.price,
        payWithStamps: action.payload.payWithStamps,
        giveStamps: action.payload.giveStamps,
        product: action.payload,
      });
      state.storedPaymentItems = items;

      const total = calculateTotal(items);
      state.paymentTotal = total.total;
      state.paymentCoffeeStamps = total.coffeeStamps;
      state.paymentBottleStamps = total.bottleStamps;
    },
    removePaymentItemAtIndex: (state, action: PayloadAction<number>) => {
      const items = state.storedPaymentItems.slice();
      items.splice(action.payload, 1);
      state.storedPaymentItems = items;

      const total = calculateTotal(items);
      state.paymentTotal = total.total;
      state.paymentCoffeeStamps = total.coffeeStamps;
      state.paymentBottleStamps = total.bottleStamps;
    },
    setPaymentItemStamps: (
      state,
      action: PayloadAction<{
        index: number;
        payWithStamps: StampType;
        giveStamps: StampType;
      }>
    ) => {
      const items = state.storedPaymentItems.slice();
      items[action.payload.index].payWithStamps = action.payload.payWithStamps;
      items[action.payload.index].giveStamps = action.payload.giveStamps;
      state.storedPaymentItems = items;

      const total = calculateTotal(items);
      state.paymentTotal = total.total;
      state.paymentCoffeeStamps = total.coffeeStamps;
      state.paymentBottleStamps = total.bottleStamps;
    },
    setScreensaver: (state, action: PayloadAction<boolean>) => {
      state.screensaver = action.payload;
      if (!action.payload) {
        state.screensaverTimeout = Date.now() + SCREENSAVER_TIMEOUT;
      }
    },
    showNotification: (
      state,
      action: PayloadAction<{
        type: NotificationType;
        title: string;
        color?: NotificationColor;
        description?: string;
      }>
    ) => {
      let list = state.notifications.slice();
      list.push({
        type: action.payload.type,
        title: action.payload.title,
        color: action.payload.color ?? NotificationColor.INFO,
        description: action.payload.description ?? '',
        timeout: Date.now() + NOTIFICATION_TIMEOUT,
      });
      state.notifications = list;
    },
    hideNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(
        (n) =>
          n.color === action.payload.color &&
          n.type === action.payload.type &&
          n.title === action.payload.title &&
          n.description === action.payload.description &&
          n.timeout === action.payload.timeout
      );
      if (index >= 0) {
        let list = state.notifications.slice();
        list.splice(index, 1);
        state.notifications = list;
      }
    },
    removeAccount: (state) => {
      state.scannedAccount = null;
    },
    payment: (state) => {
      if (state.payment) return;

      state.payment = {
        type: 'Waiting',
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        total: state.paymentTotal,
        coffeeStamps: state.paymentCoffeeStamps,
        bottleStamps: state.paymentBottleStamps,
        items: state.storedPaymentItems,
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

      if (state.notifications.length > 0) {
        state.notifications = state.notifications.filter((n) => n.timeout >= now);
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
          state.storedPaymentItems = [];
          const total = calculateTotal([]);
          state.paymentTotal = total.total;
          state.paymentCoffeeStamps = total.coffeeStamps;
          state.paymentBottleStamps = total.bottleStamps;
        }
      }
    });
    builder.addCase(receiveAccountAccessToken.rejected, (state, action) => {
      if (state.payment) {
        let errorMessage = trimPrefix(action.error.message || '', 'Transaction error: ');
        state.payment = {
          type: 'Error',
          timeout: Date.now() + PAYMENT_ERROR_TIMEOUT,
          total: state.payment.total,
          coffeeStamps: state.payment.coffeeStamps,
          bottleStamps: state.payment.bottleStamps,
          message: errorMessage,
        };
      }
    });
    builder.addCase(receiveAccountAccessToken.pending, (state) => {
      if (state.payment?.type === 'Waiting') {
        state.payment = {
          type: 'InProgress',
          timeout: Date.now() + PAYMENT_INPROGRESS_TIMEOUT,
          total: state.payment.total,
          coffeeStamps: state.payment.coffeeStamps,
          bottleStamps: state.payment.bottleStamps,
          items: state.payment.items,
        };
      }
    });
  },
});

export const {
  setKeypadValue,
  submitKeypadValue,
  addProduct,
  removePaymentItemAtIndex,
  setPaymentItemStamps,
  setScreensaver,
  showNotification,
  hideNotification,
  removeAccount,
  payment,
  cancelPayment,
  checkTimeouts,
} = paymentSlice.actions;
export default paymentSlice.reducer;
