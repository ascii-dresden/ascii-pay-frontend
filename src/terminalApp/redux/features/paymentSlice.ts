import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AccountDto,
  CoinAmountDto,
  PaymentDto,
  PaymentResponseDto,
  ProductDto,
} from "../../../common/contracts";
import {
  addCoinAmount,
  calculateStampPaymentTransactionItems,
  checkIfAccountBalanceIsSufficient,
  getEffectivePrice,
  getPaymentItemSum,
  PseudoProductDto,
} from "../../../common/transactionUtils";
import { TerminalDispatch, TerminalState } from "../terminalStore";
import { ReceiveKeyboardEventKey } from "../../client/websocket";
import { validateKeypadValue } from "../../payment/Keypad";
import { BASE_URL } from "../../../const";

const PAYMENT_WAITING_TIMEOUT = 30_000;
const PAYMENT_INPROGRESS_TIMEOUT = 3_000;
const PAYMENT_ERROR_TIMEOUT = 5_000;
const PAYMENT_SUCCESS_TIMEOUT = 2_000;

export type PaymentTransactionItem = {
  product: PseudoProductDto;
  colorHint?: string;
  currentPriceIndex?: number;
};

export interface PaymentPaymentWaiting {
  type: "Waiting";
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  total: CoinAmountDto;
  items: PaymentTransactionItem[];
}

export interface PaymentPaymentReCalculateStamps {
  type: "ReCalculateStamps";
  timeout: number;
  total: CoinAmountDto;
  items: PaymentTransactionItem[];
  accountAccessToken: string;
  withStamps: {
    total: CoinAmountDto;
    items: PaymentTransactionItem[];
  };
}

export interface PaymentPaymentInProgress {
  type: "InProgress";
  timeout: number;
  stopIfStampPaymentIsPossible: boolean;
  total: CoinAmountDto;
  items: PaymentTransactionItem[];
}

export interface PaymentPaymentError {
  type: "Error";
  timeout: number;
  total: CoinAmountDto;
  message: string;
}

export interface PaymentPaymentSuccess {
  type: "Success";
  timeout: number;
  total: CoinAmountDto;
}

export type PaymentPayment =
  | PaymentPaymentWaiting
  | PaymentPaymentInProgress
  | PaymentPaymentReCalculateStamps
  | PaymentPaymentError
  | PaymentPaymentSuccess;

interface PaymentState {
  keypadValue: number;
  storedPaymentItems: PaymentTransactionItem[];
  scannedAccount: AccountDto | null;
  scannedToken: string | null;
  paymentTotal: CoinAmountDto;
  payment: PaymentPayment | null;
}

export const initialState: PaymentState = {
  keypadValue: 0,
  storedPaymentItems: [],
  scannedAccount: null,
  scannedToken: null,
  paymentTotal: {},
  payment: null,
};

function calculateTotal(state: PaymentState): CoinAmountDto {
  return addCoinAmount(
    { Cent: state.keypadValue },
    getPaymentItemSum(state.storedPaymentItems, state.scannedAccount)
  );
}

async function getAccount(token: string): Promise<AccountDto | null> {
  let response = await fetch(`${BASE_URL}/auth/account`, {
    method: "GET",
    credentials: "omit",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  let account = (await response.json()) as AccountDto | null;
  return account?.id ? account : null;
}

async function accountPayment(
  accountId: number,
  token: string,
  payment: PaymentDto
): Promise<PaymentResponseDto | null> {
  let response = await fetch(`${BASE_URL}/account/${accountId}/payment`, {
    method: "POST",
    credentials: "omit",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payment),
  });
  let data = (await response.json()) as PaymentResponseDto | null;
  return data?.transaction?.id ? data : null;
}

export const receiveAccountSessionToken = createAsyncThunk<
  {
    account: AccountDto | null;
    token: string | null;
    payment: PaymentPayment | null;
  },
  string,
  {
    dispatch: TerminalDispatch;
    state: TerminalState;
  }
>("payment/receiveAccountSessionToken", async (query, thunkApi) => {
  const payment = thunkApi.getState().paymentState.payment;

  try {
    let account = await getAccount(query);

    if (!account) {
      return {
        account: null,
        token: null,
        payment: null,
      };
    }

    if (payment && payment.type === "InProgress") {
      let stampPaymentItems = calculateStampPaymentTransactionItems(
        account,
        account.balance,
        payment.items
      );
      if (
        payment.stopIfStampPaymentIsPossible &&
        stampPaymentItems &&
        account.enable_automatic_stamp_usage
      ) {
        return {
          account: account,
          token: query,
          payment: {
            type: "ReCalculateStamps",
            timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
            total: payment.total,
            items: payment.items,
            accountAccessToken: query,
            withStamps: {
              total: getPaymentItemSum(stampPaymentItems, account),
              items: stampPaymentItems,
            },
          },
        };
      }

      if (!checkIfAccountBalanceIsSufficient(account, payment.items)) {
        return {
          account: account,
          token: query,
          payment: {
            type: "Error",
            message: "Insufficient balance!",
            timeout: Date.now() + PAYMENT_ERROR_TIMEOUT,
            total: payment.total,
          },
        };
      }

      let data = await accountPayment(account.id, query, {
        items: payment.items.map((item) => {
          let effective_price = getEffectivePrice(item, account);
          return {
            effective_price: effective_price,
            product_id: item.product?.id,
          };
        }),
      });

      if (data) {
        return {
          account: data.account,
          token: query,
          payment: {
            type: "Success",
            timeout: Date.now() + PAYMENT_SUCCESS_TIMEOUT,
            total: payment.total,
          },
        };
      } else {
        return {
          account: account,
          token: query,
          payment: {
            type: "Error",
            message: "Could not execute transaction!",
            timeout: Date.now() + PAYMENT_ERROR_TIMEOUT,
            total: payment.total,
          },
        };
      }
    }

    return {
      account,
      token: query,
      payment: null,
    };
  } catch {
    return {
      account: null,
      token: null,
      payment: null,
    };
  }
});

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    receiveKeyEvent: (
      state,
      action: PayloadAction<ReceiveKeyboardEventKey>
    ) => {
      switch (action.payload) {
        case "NUM_0":
          state.keypadValue = validateKeypadValue(state.keypadValue * 10);
          break;
        case "NUM_1":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + Math.sign(state.keypadValue) || 1
          );
          break;
        case "NUM_2":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 2
          );
          break;
        case "NUM_3":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 3
          );
          break;
        case "NUM_4":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 4
          );
          break;
        case "NUM_5":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 5
          );
          break;
        case "NUM_6":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 6
          );
          break;
        case "NUM_7":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 7
          );
          break;
        case "NUM_8":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 8
          );
          break;
        case "NUM_9":
          state.keypadValue = validateKeypadValue(
            state.keypadValue * 10 + (Math.sign(state.keypadValue) || 1) * 9
          );
          break;
        case "NEGATE":
          state.keypadValue = validateKeypadValue(-state.keypadValue);
          break;
        case "BACKSPACE":
          state.keypadValue = validateKeypadValue(
            Math.sign(state.keypadValue) *
              Math.floor(Math.abs(state.keypadValue / 10))
          );
          break;
      }
      state.paymentTotal = calculateTotal(state);
    },
    setKeypadValue: (state, action: PayloadAction<number>) => {
      state.keypadValue = action.payload;
      state.paymentTotal = calculateTotal(state);
    },
    submitKeypadValue: (state, action: PayloadAction<[number, string]>) => {
      state.storedPaymentItems.push({
        product: {
          name: action.payload[1],
          price: {
            Cent: action.payload[0],
          },
          bonus: {},
          status_prices: [],
        },
      });
      state.keypadValue = 0;
      state.paymentTotal = calculateTotal(state);
    },
    addProduct: (state, action: PayloadAction<ProductDto>) => {
      state.storedPaymentItems.push({
        product: action.payload,
      });
      state.paymentTotal = calculateTotal(state);
    },
    addPaymentItem: (state, action: PayloadAction<PaymentTransactionItem>) => {
      state.storedPaymentItems.push(action.payload);
      state.paymentTotal = calculateTotal(state);
    },
    removePaymentItemAtIndex: (state, action: PayloadAction<number>) => {
      state.storedPaymentItems.splice(action.payload, 1);
      state.paymentTotal = calculateTotal(state);
    },
    clearPaymentItems: (state) => {
      state.storedPaymentItems = [];
      state.paymentTotal = calculateTotal(state);
    },
    removeAccount: (state) => {
      state.scannedAccount = null;
      state.paymentTotal = calculateTotal(state);
    },
    payment: (state, action: PayloadAction<[string, string]>) => {
      if (state.keypadValue !== 0) {
        let label =
          state.keypadValue >= 0 ? action.payload[0] : action.payload[1];

        state.storedPaymentItems.push({
          product: {
            name: label,
            price: {
              Cent: state.keypadValue,
            },
            bonus: {},
            status_prices: [],
          },
        });
        state.keypadValue = 0;
        state.paymentTotal = calculateTotal(state);
      }

      if (state.payment) return;
      if (state.storedPaymentItems.length <= 0) return;

      state.payment = {
        type: "Waiting",
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        stopIfStampPaymentIsPossible: true,
        total: state.paymentTotal,
        items: state.storedPaymentItems,
      };
    },
    paymentProceedWithStamps: (state) => {
      if (state.payment?.type !== "ReCalculateStamps") return;

      state.payment = {
        type: "Waiting",
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        stopIfStampPaymentIsPossible: false,
        total: state.payment.withStamps.total,
        items: state.payment.withStamps.items,
      };
    },
    paymentProceedWithoutStamps: (state) => {
      if (state.payment?.type !== "ReCalculateStamps") return;

      state.payment = {
        type: "Waiting",
        timeout: Date.now() + PAYMENT_WAITING_TIMEOUT,
        stopIfStampPaymentIsPossible: false,
        total: state.payment.total,
        items: state.payment.items,
      };
    },
    cancelPayment: (state) => {
      state.payment = null;
    },
    checkPaymentTimeout: (state) => {
      const now = Date.now();

      if (state.payment && state.payment.timeout < now) {
        state.payment = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(receiveAccountSessionToken.pending, (state) => {
      if (state.payment?.type === "Waiting") {
        state.payment = {
          type: "InProgress",
          timeout: Date.now() + PAYMENT_INPROGRESS_TIMEOUT,
          stopIfStampPaymentIsPossible:
            state.payment.stopIfStampPaymentIsPossible,
          total: state.payment.total,
          items: state.payment.items,
        };
      }
    });
    builder.addCase(receiveAccountSessionToken.fulfilled, (state, action) => {
      state.scannedAccount = action.payload.account;
      state.scannedToken = action.payload.token;
      state.payment = action.payload.payment;
      state.paymentTotal = calculateTotal(state);

      if (action.payload.payment) {
        state.payment = action.payload.payment;

        if (state.payment.type === "Success") {
          state.keypadValue = 0;
          state.storedPaymentItems = [];
          state.paymentTotal = calculateTotal(state);
        }
      }
    });
  },
});

export const {
  receiveKeyEvent,
  setKeypadValue,
  submitKeypadValue,
  addProduct,
  addPaymentItem,
  removePaymentItemAtIndex,
  clearPaymentItems,
  removeAccount,
  payment,
  paymentProceedWithStamps,
  paymentProceedWithoutStamps,
  cancelPayment,
  checkPaymentTimeout,
} = paymentSlice.actions;
export default paymentSlice.reducer;
