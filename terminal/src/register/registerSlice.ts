import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum RegisterMode {
  COINS,
  NOTES,
  RESULT,
}

export interface CoinBoxState {
  coin200: number;
  coin100: number;
  coin50: number;
  coin20: number;
  coin10: number;
  coin5: number;
  coin2: number;
  coin1: number;
}

export interface NoteBoxState {
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  note5: number;
}

interface RegisterState {
  registerMode: RegisterMode;
  coinBox: CoinBoxState;
  noteBox: NoteBoxState;
  previous: {
    coinBox: CoinBoxState;
    noteBox: NoteBoxState;
  } | null;
}

const targetNoteBox: NoteBoxState = {
  note100: 0,
  note50: 0,
  note20: 0,
  note10: 2,
  note5: 2,
};
const targetCoinBox: CoinBoxState = {
  coin200: 13,
  coin100: 25,
  coin50: 23,
  coin20: 25,
  coin10: 25,
  coin5: 0,
  coin2: 0,
  coin1: 0,
};

const initialState: RegisterState = {
  registerMode: RegisterMode.COINS,
  coinBox: { ...targetCoinBox },
  noteBox: { ...targetNoteBox },
  previous: null,
};

export function getTotal(coinBox: CoinBoxState, noteBox: NoteBoxState): number {
  return (
    coinBox.coin1 * 1 +
    coinBox.coin2 * 2 +
    coinBox.coin5 * 5 +
    coinBox.coin10 * 10 +
    coinBox.coin20 * 20 +
    coinBox.coin50 * 50 +
    coinBox.coin100 * 100 +
    coinBox.coin200 * 200 +
    noteBox.note5 * 500 +
    noteBox.note10 * 1000 +
    noteBox.note20 * 2000 +
    noteBox.note50 * 5000 +
    noteBox.note100 * 10000
  );
}

function getCashProblemWeight(centValue: number, currentCount: number, targetCount: number): number {
  let weight = 1;

  switch (centValue) {
    case 10000:
      weight = 10.0;
      break;
    case 5000:
      weight = 10.0;
      break;
    case 2000:
      weight = 4.0;
      break;
    case 1000:
      weight = 1.1;
      break;
    case 500:
      weight = 1.1;
      break;
    case 200:
      weight = 1.0;
      break;
    case 100:
      weight = 0.9;
      break;
    case 50:
      weight = 0.9;
      break;
    case 20:
      weight = 1.2;
      break;
    case 10:
      weight = 1.5;
      break;
    case 5:
      weight = 6.0;
      break;
    case 2:
      weight = 9.0;
      break;
    case 1:
      weight = 9.0;
      break;
  }

  return (targetCount - currentCount) * weight;
}

function solveCashProblem(coinBox: CoinBoxState, noteBox: NoteBoxState): [CoinBoxState, NoteBoxState] {
  const targetTotal = getTotal(targetCoinBox, targetNoteBox);

  const workingCoinBox: CoinBoxState = { ...coinBox };
  const workingNoteBox: NoteBoxState = { ...noteBox };

  let currentTotal = getTotal(workingCoinBox, workingNoteBox);

  while (currentTotal > targetTotal) {
    let boxHelper = [
      {
        centValue: 10000,
        currentCount: workingNoteBox.note100,
        targetCount: targetNoteBox.note100,
        reduce: () => (workingNoteBox.note100 -= 1),
      },
      {
        centValue: 5000,
        currentCount: workingNoteBox.note50,
        targetCount: targetNoteBox.note50,
        reduce: () => (workingNoteBox.note50 -= 1),
      },
      {
        centValue: 2000,
        currentCount: workingNoteBox.note20,
        targetCount: targetNoteBox.note20,
        reduce: () => (workingNoteBox.note20 -= 1),
      },
      {
        centValue: 1000,
        currentCount: workingNoteBox.note10,
        targetCount: targetNoteBox.note10,
        reduce: () => (workingNoteBox.note10 -= 1),
      },
      {
        centValue: 500,
        currentCount: workingNoteBox.note5,
        targetCount: targetNoteBox.note5,
        reduce: () => (workingNoteBox.note5 -= 1),
      },
      {
        centValue: 200,
        currentCount: workingCoinBox.coin200,
        targetCount: workingCoinBox.coin200,
        reduce: () => (workingCoinBox.coin200 -= 1),
      },
      {
        centValue: 100,
        currentCount: workingCoinBox.coin100,
        targetCount: targetCoinBox.coin100,
        reduce: () => (workingCoinBox.coin100 -= 1),
      },
      {
        centValue: 50,
        currentCount: workingCoinBox.coin50,
        targetCount: targetCoinBox.coin50,
        reduce: () => (workingCoinBox.coin50 -= 1),
      },
      {
        centValue: 20,
        currentCount: workingCoinBox.coin20,
        targetCount: targetCoinBox.coin20,
        reduce: () => (workingCoinBox.coin20 -= 1),
      },
      {
        centValue: 10,
        currentCount: workingCoinBox.coin10,
        targetCount: targetCoinBox.coin10,
        reduce: () => (workingCoinBox.coin10 -= 1),
      },
      {
        centValue: 5,
        currentCount: workingCoinBox.coin5,
        targetCount: targetCoinBox.coin5,
        reduce: () => (workingCoinBox.coin5 -= 1),
      },
      {
        centValue: 2,
        currentCount: workingCoinBox.coin2,
        targetCount: targetCoinBox.coin2,
        reduce: () => (workingCoinBox.coin2 -= 1),
      },
      {
        centValue: 1,
        currentCount: workingCoinBox.coin1,
        targetCount: targetCoinBox.coin1,
        reduce: () => (workingCoinBox.coin1 -= 1),
      },
    ].filter((it) => currentTotal - it.centValue >= targetTotal && it.currentCount > 0);

    boxHelper.sort(
      (a, b) =>
        getCashProblemWeight(a.centValue, a.currentCount, a.targetCount) -
        getCashProblemWeight(b.centValue, b.currentCount, b.targetCount)
    );

    if (boxHelper[0]) {
      boxHelper[0].reduce();
    } else {
      return [workingCoinBox, workingNoteBox];
    }
    currentTotal = getTotal(workingCoinBox, workingNoteBox);
  }

  return [workingCoinBox, workingNoteBox];
}

export const registerSlice = createSlice({
  name: 'register',
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
    setRegisterMode: (state, action: PayloadAction<RegisterMode>) => {
      state.registerMode = action.payload;
    },
    toggleResultMode: (state) => {
      if (state.previous === null) {
        let [nextCoinBox, nextNoteBox] = solveCashProblem(state.coinBox, state.noteBox);
        state.previous = {
          coinBox: state.coinBox,
          noteBox: state.noteBox,
        };
        state.coinBox = nextCoinBox;
        state.noteBox = nextNoteBox;
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
  setRegisterMode,
  toggleResultMode,
} = registerSlice.actions;
export default registerSlice.reducer;
