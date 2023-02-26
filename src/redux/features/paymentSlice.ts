import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountDto, CoinAmountDto, ProductDto } from "../api/contracts";
import {
  addCoinAmount,
  PseudoProductDto,
  selectNextCoinAmount,
} from "../../components/transaction/transactionUtils";
import { BASE_URL } from "../api/customFetchBase";

export type PaymentTransactionItem = {
  product: PseudoProductDto;
  effective_price: CoinAmountDto;
  colorHint?: string;
};

interface PaymentState {
  keypadValue: number;
  storedPaymentItems: PaymentTransactionItem[];
  scannedAccount: AccountDto | null;
  scannedToken: string | null;
  paymentTotal: CoinAmountDto;
}

export const initialState: PaymentState = {
  keypadValue: 0,
  storedPaymentItems: [],
  scannedAccount: null,
  scannedToken: null,
  paymentTotal: {},
};

function calculateTotal(state: PaymentState): CoinAmountDto {
  let total: CoinAmountDto = {
    Cent: state.keypadValue,
  };
  for (const item of state.storedPaymentItems) {
    total = addCoinAmount(total, item.effective_price);
  }
  return total;
}

export const receiveAccountSessionToken = createAsyncThunk<
  {
    account: AccountDto | null;
    token: string;
  },
  string
>("payment/receiveAccountSessionToken", async (query) => {
  console.log(query);
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
    if (!account?.balance) {
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

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
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
        },
        effective_price: {
          Cent: action.payload[0],
        },
      });
      state.keypadValue = 0;
      state.paymentTotal = calculateTotal(state);
    },
    addProduct: (state, action: PayloadAction<ProductDto>) => {
      state.storedPaymentItems.push({
        product: action.payload,
        effective_price: selectNextCoinAmount(action.payload, {}),
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(receiveAccountSessionToken.fulfilled, (state, action) => {
      state.scannedAccount = action.payload.account;
      state.scannedToken = action.payload.token;
    });
  },
});

export const {
  setKeypadValue,
  submitKeypadValue,
  addProduct,
  addPaymentItem,
  removePaymentItemAtIndex,
  clearPaymentItems,
  removeAccount,
} = paymentSlice.actions;
export default paymentSlice.reducer;
