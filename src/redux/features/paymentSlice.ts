import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountDto, CoinAmountDto, ProductDto } from "../api/contracts";
import {
  addCoinAmount,
  PseudoProductDto,
  selectNextCoinAmount,
} from "../../components/transaction/transactionUtils";

export type PaymentTransactionItem = {
  product: PseudoProductDto;
  effective_price: CoinAmountDto;
  colorHint?: string;
};

interface PaymentState {
  keypadValue: number;
  storedPaymentItems: PaymentTransactionItem[];
  scannedAccount: AccountDto | null;
  paymentTotal: CoinAmountDto;
}

export const initialState: PaymentState = {
  keypadValue: 0,
  storedPaymentItems: [],
  scannedAccount: null,
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
