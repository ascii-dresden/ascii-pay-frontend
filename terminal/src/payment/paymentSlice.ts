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
  couldBePaidWithStamps: StampType;
  giveStamps: StampType;
  product: PaymentProduct | null;
  nameHint?: string;
  colorHint?: string;
}

export interface PaymentPaymentWaiting {
  type: 'Waiting';
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  items: PaymentItem[];
}

export interface PaymentPaymentRecalculateStamps {
  type: 'ReacalculateStamps';
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  accountAccessToken: string;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  items: PaymentItem[];
  withStamps: {
    total: number;
    coffeeStamps: number;
    bottleStamps: number;
    items: PaymentItem[];
  };
}

export interface PaymentPaymentInProgress {
  type: 'InProgress';
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  items: PaymentItem[];
}
export interface PaymentPaymentError {
  type: 'Error';
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  message: string;
}
export interface PaymentPaymentSuccess {
  type: 'Success';
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
}
export type PaymentPayment =
  | PaymentPaymentWaiting
  | PaymentPaymentInProgress
  | PaymentPaymentRecalculateStamps
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

export function paymentItemEqual(a: PaymentItem, b: PaymentItem): boolean {
  if (a.price !== b.price) return false;
  if (a.payWithStamps !== b.payWithStamps) return false;
  if (a.couldBePaidWithStamps !== b.couldBePaidWithStamps) return false;
  if (a.giveStamps !== b.giveStamps) return false;
  if (a.product?.id !== b.product?.id) return false;
  if (a.nameHint !== b.nameHint) return false;
  if (a.colorHint !== b.colorHint) return false;

  return true;
}

export function groupPaymentItems(items: PaymentItem[]): Map<PaymentItem, number> {
  let map = new Map<PaymentItem, number>();

  for (let item of items) {
    let found = false;
    for (let [key, value] of map) {
      if (paymentItemEqual(item, key)) {
        found = true;
        map.set(key, value + 1);
        break;
      }
    }

    if (!found) {
      map.set(item, 1);
    }
  }

  return map;
}

function calcAlternativeStamps(
  current: {
    total: number;
    coffeeStamps: number;
    bottleStamps: number;
    items: PaymentItem[];
  },
  account: PaymentAccount
): {
  total: number;
  coffeeStamps: number;
  bottleStamps: number;
  items: PaymentItem[];
} {
  let newItems = current.items.slice();

  let maxPrice: number = 0;
  let maxIndex: number = -1;
  for (let i = 0; i < newItems.length; i++) {
    let item = newItems[i];

    if (item.payWithStamps !== StampType.NONE) {
      continue;
    }

    switch (item.couldBePaidWithStamps) {
      case StampType.COFFEE:
        if (account.coffeeStamps >= 10 && item.price > maxPrice) {
          maxIndex = i;
          maxPrice = item.price;
        }
        break;
      case StampType.BOTTLE:
        if (account.bottleStamps >= 10 && item.price > maxPrice) {
          maxIndex = i;
          maxPrice = item.price;
        }
        break;
    }
  }

  if (maxIndex >= 0) {
    let item = newItems[maxIndex];

    let newItem: PaymentItem = {
      ...item,
      price: 0,
      payWithStamps: item.couldBePaidWithStamps,
      giveStamps: StampType.NONE,
    };

    newItems.splice(maxIndex, 1, newItem);
  }

  let total = calculateTotal(newItems);

  return {
    total: total.total,
    coffeeStamps: total.coffeeStamps,
    bottleStamps: total.bottleStamps,
    items: newItems,
  };
}

async function onReceiveAccountAccessToken(
  accessToken: string,
  state: PaymentState,
  apollo: ApolloClient<object>
): Promise<{
  account: PaymentAccount | null;
  payment?: PaymentPayment;
}> {
  if (state.payment && state.payment.type === 'InProgress') {
    const payment = state.payment;
    const variables: transactionVariables = {
      accountAccessToken: accessToken,
      stopIfStampPaymentIsPossible: payment.stopIfStampPaymentIsPossible,
      transactionItems: state.payment.items.map((i) => {
        return {
          price: -i.price,
          couldBePaidWithStamps: i.couldBePaidWithStamps,
          payWithStamps: i.payWithStamps,
          giveStamps: i.giveStamps,
          productId: i.product?.id,
        };
      }),
    };

    let result = await apollo.mutate<transaction, transactionVariables>({
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
          stopIfStampPaymentIsPossible: payment.stopIfStampPaymentIsPossible,
          total: payment.total,
          coffeeStamps: payment.coffeeStamps,
          bottleStamps: payment.bottleStamps,
        },
      };
    } else {
      let data = result.data;

      if (data.transaction.error) {
        let account = {
          id: data.transaction.account.id,
          name: data.transaction.account.name,
          credit: data.transaction.account.credit,
          coffeeStamps: data.transaction.account.coffeeStamps,
          bottleStamps: data.transaction.account.bottleStamps,
        };
        let withStamps = calcAlternativeStamps(
          {
            total: payment.total,
            coffeeStamps: payment.coffeeStamps,
            bottleStamps: payment.bottleStamps,
            items: payment.items,
          },
          account
        );

        return {
          account: account,
          payment: {
            type: 'ReacalculateStamps',
            timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
            stopIfStampPaymentIsPossible: payment.stopIfStampPaymentIsPossible,
            accountAccessToken: data.transaction.accountAccessToken ?? '',
            total: payment.total,
            coffeeStamps: payment.coffeeStamps,
            bottleStamps: payment.bottleStamps,
            items: payment.items,
            withStamps: withStamps,
          },
        };
      } else {
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
            stopIfStampPaymentIsPossible: payment.stopIfStampPaymentIsPossible,
            total: payment.total,
            coffeeStamps: payment.coffeeStamps,
            bottleStamps: payment.bottleStamps,
          },
        };
      }
    }
  } else {
    const variables: getAccountByAccessTokenVariables = {
      accountAccessToken: accessToken,
    };
    let result = await apollo.query<getAccountByAccessToken, getAccountByAccessTokenVariables>({
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
}

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

  return await onReceiveAccountAccessToken(query.accessToken, state, query.apollo);
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
        couldBePaidWithStamps: StampType.NONE,
        giveStamps: StampType.NONE,
        product: null,
        nameHint: 'Eigener Betrag',
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
        couldBePaidWithStamps: StampType.NONE,
        giveStamps: action.payload.giveStamps,
        product: action.payload,
      });
      state.storedPaymentItems = items;

      const total = calculateTotal(items);
      state.paymentTotal = total.total;
      state.paymentCoffeeStamps = total.coffeeStamps;
      state.paymentBottleStamps = total.bottleStamps;
    },
    addPaymentItem: (state, action: PayloadAction<PaymentItem>) => {
      const items = state.storedPaymentItems.slice();
      items.push(action.payload);
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
      if (state.storedPaymentItems.length <= 0) return;

      state.payment = {
        type: 'Waiting',
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        stopIfStampPaymentIsPossible: true,
        total: state.paymentTotal,
        coffeeStamps: state.paymentCoffeeStamps,
        bottleStamps: state.paymentBottleStamps,
        items: state.storedPaymentItems,
      };
    },
    paymentProceedWithStamps: (state) => {
      if (state.payment?.type !== 'ReacalculateStamps') return;

      state.payment = {
        type: 'Waiting',
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        stopIfStampPaymentIsPossible: false,
        total: state.payment.withStamps.total,
        coffeeStamps: state.payment.withStamps.coffeeStamps,
        bottleStamps: state.payment.withStamps.bottleStamps,
        items: state.payment.withStamps.items,
      };
    },
    paymentProceedWithoutStamps: (state) => {
      if (state.payment?.type !== 'ReacalculateStamps') return;

      state.payment = {
        type: 'Waiting',
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        stopIfStampPaymentIsPossible: false,
        total: state.payment.total,
        coffeeStamps: state.payment.coffeeStamps,
        bottleStamps: state.payment.bottleStamps,
        items: state.payment.items,
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
          stopIfStampPaymentIsPossible: state.payment.stopIfStampPaymentIsPossible,
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
          stopIfStampPaymentIsPossible: state.payment.stopIfStampPaymentIsPossible,
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
  addPaymentItem,
  removePaymentItemAtIndex,
  setPaymentItemStamps,
  setScreensaver,
  showNotification,
  hideNotification,
  removeAccount,
  payment,
  paymentProceedWithStamps,
  paymentProceedWithoutStamps,
  cancelPayment,
  checkTimeouts,
} = paymentSlice.actions;
export default paymentSlice.reducer;
