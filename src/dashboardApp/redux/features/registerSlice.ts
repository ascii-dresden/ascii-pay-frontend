import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CoinBoxState,
  NoteBoxState,
  saveRegisterHistory,
  solveCashProblem,
  targetCoinBox,
  targetNoteBox,
} from "../../../common/registerHistoryUtils";

interface RegisterState {
  coinBox: CoinBoxState;
  noteBox: NoteBoxState;
  previous: {
    coinBox: CoinBoxState;
    noteBox: NoteBoxState;
  } | null;
}

const initialState: RegisterState = {
  coinBox: { ...targetCoinBox },
  noteBox: { ...targetNoteBox },
  previous: null,
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setNote100: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.noteBox.note100 = Math.max(0, action.payload);
    },
    setNote50: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.noteBox.note50 = Math.max(0, action.payload);
    },
    setNote20: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.noteBox.note20 = Math.max(0, action.payload);
    },
    setNote10: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.noteBox.note10 = Math.max(0, action.payload);
    },
    setNote5: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.noteBox.note5 = Math.max(0, action.payload);
    },
    setCoin200: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin200 = Math.max(0, action.payload);
    },
    setCoin100: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin100 = Math.max(0, action.payload);
    },
    setCoin50: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin50 = Math.max(0, action.payload);
    },
    setCoin20: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin20 = Math.max(0, action.payload);
    },
    setCoin10: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin10 = Math.max(0, action.payload);
    },
    setCoin5: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin5 = Math.max(0, action.payload);
    },
    setCoin2: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin2 = Math.max(0, action.payload);
    },
    setCoin1: (state, action: PayloadAction<number>) => {
      if (state.previous) return;
      state.coinBox.coin1 = Math.max(0, action.payload);
    },
    toggleResultMode: (state) => {
      if (state.previous === null) {
        let nextBoxes = solveCashProblem(state.coinBox, state.noteBox);
        state.previous = {
          coinBox: state.coinBox,
          noteBox: state.noteBox,
        };
        state.coinBox = nextBoxes.coinBox;
        state.noteBox = nextBoxes.noteBox;

        saveRegisterHistory({
          coinBox: nextBoxes.coinBox,
          noteBox: nextBoxes.noteBox,
          previous: {
            coinBox: state.previous.coinBox,
            noteBox: state.previous.noteBox,
          },
        });
      } else {
        state.coinBox = state.previous.coinBox;
        state.noteBox = state.previous.noteBox;
        state.previous = null;
      }
    },
  },
});

export const {
  setNote100,
  setNote50,
  setNote20,
  setNote10,
  setNote5,
  setCoin200,
  setCoin100,
  setCoin50,
  setCoin20,
  setCoin10,
  setCoin5,
  setCoin2,
  setCoin1,
  toggleResultMode,
} = registerSlice.actions;
export default registerSlice.reducer;
