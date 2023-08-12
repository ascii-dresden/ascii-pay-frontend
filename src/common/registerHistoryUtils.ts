import { RegisterHistoryStateDto, SaveRegisterHistoryDto } from "./contracts";
import { BASE_URL } from "../const";

export type CoinBoxState = {
  coin200: number;
  coin100: number;
  coin50: number;
  coin20: number;
  coin10: number;
  coin5: number;
  coin2: number;
  coin1: number;
};

export type NoteBoxState = {
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  note5: number;
};

export const targetNoteBox: NoteBoxState = {
  note100: 0,
  note50: 0,
  note20: 0,
  note10: 1,
  note5: 4,
};
export const targetCoinBox: CoinBoxState = {
  coin200: 13,
  coin100: 25,
  coin50: 23,
  coin20: 25,
  coin10: 25,
  coin5: 0,
  coin2: 0,
  coin1: 0,
};

export function getRegisterTotal(
  coinBox: CoinBoxState,
  noteBox: NoteBoxState
): number {
  return (
    coinBox.coin1 +
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

function getCashProblemWeight(
  centValue: number,
  currentCount: number,
  targetCount: number
): number {
  let weight = 1;

  switch (centValue) {
    case 10000:
      weight = 50.0;
      break;
    case 5000:
      weight = 20.0;
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

export function solveCashProblem(
  coinBox: CoinBoxState,
  noteBox: NoteBoxState
): { coinBox: CoinBoxState; noteBox: NoteBoxState } {
  const targetTotal = getRegisterTotal(targetCoinBox, targetNoteBox);

  const workingCoinBox: CoinBoxState = { ...coinBox };
  const workingNoteBox: NoteBoxState = { ...noteBox };

  let currentTotal = getRegisterTotal(workingCoinBox, workingNoteBox);
  while (currentTotal > targetTotal) {
    let currentTotalCompute = currentTotal;
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
    ].filter(
      (it) =>
        currentTotalCompute - it.centValue >= targetTotal && it.currentCount > 0
    );

    boxHelper.sort(
      (a, b) =>
        getCashProblemWeight(a.centValue, a.currentCount, a.targetCount) -
        getCashProblemWeight(b.centValue, b.currentCount, b.targetCount)
    );

    if (boxHelper[0]) {
      boxHelper[0].reduce();
    } else {
      return {
        coinBox: workingCoinBox,
        noteBox: workingNoteBox,
      };
    }
    currentTotal = getRegisterTotal(workingCoinBox, workingNoteBox);
  }

  return {
    coinBox: workingCoinBox,
    noteBox: workingNoteBox,
  };
}

export function saveRegisterHistory(state: {
  coinBox: CoinBoxState;
  noteBox: NoteBoxState;
  previous: {
    coinBox: CoinBoxState;
    noteBox: NoteBoxState;
  };
}) {
  const currentTotal = getRegisterTotal(
    state.previous.coinBox,
    state.previous.noteBox
  );
  if (currentTotal === 10000) {
    return;
  }

  let body: SaveRegisterHistoryDto = {
    source_register: {
      ...state.previous.noteBox,
      ...state.previous.coinBox,
    },
    target_register: {
      ...state.noteBox,
      ...state.coinBox,
    },
    envelope_register: {
      coin200: state.previous.coinBox.coin200 - state.coinBox.coin200,
      coin100: state.previous.coinBox.coin100 - state.coinBox.coin100,
      coin50: state.previous.coinBox.coin50 - state.coinBox.coin50,
      coin20: state.previous.coinBox.coin20 - state.coinBox.coin20,
      coin10: state.previous.coinBox.coin10 - state.coinBox.coin10,
      coin5: state.previous.coinBox.coin5 - state.coinBox.coin5,
      coin2: state.previous.coinBox.coin2 - state.coinBox.coin2,
      coin1: state.previous.coinBox.coin1 - state.coinBox.coin1,
      note100: state.previous.noteBox.note100 - state.noteBox.note100,
      note50: state.previous.noteBox.note50 - state.noteBox.note50,
      note20: state.previous.noteBox.note20 - state.noteBox.note20,
      note10: state.previous.noteBox.note10 - state.noteBox.note10,
      note5: state.previous.noteBox.note5 - state.noteBox.note5,
    },
  };

  fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .then((r) => console.log("Successfully created register history entry", r))
    .catch((e) => console.error(e));
}

export function getRegisterHistorySum(
  registerHistory: RegisterHistoryStateDto
): number {
  return getRegisterTotal(registerHistory, registerHistory);
}
