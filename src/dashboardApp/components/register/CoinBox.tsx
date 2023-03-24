import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  useDashboardDispatch,
  useDashboardSelector,
} from "../../redux/dashboardStore";
import {
  setCoin1,
  setCoin10,
  setCoin100,
  setCoin2,
  setCoin20,
  setCoin200,
  setCoin5,
  setCoin50,
} from "../../redux/features/registerSlice";
import { moneyToString } from "../../../terminalApp/components/Money";

const StyledCoinBox = styled.div`
  position: relative;
  left: 0;
  top: 0;
  height: 32em;
  width: 54em;
  user-select: none;

  background-color: #003b6f;
  color: #fff;
  padding: 1.5em;
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
  grid-gap: 0.4em;
  touch-action: none;

  .coin {
    font-size: 0.88em;
  }

  & > div > div > span {
    display: block;
    font-weight: 800;
    padding-bottom: 0.2em;
  }

  & > div > div:not(:first-of-type) > span {
    padding-top: 0.35em;
  }

  .coin {
    background-color: #fff;
    width: 2.2em;
    margin-top: 1px;
    display: block;
  }

  .coin.previous {
    opacity: 0.4;
  }

  .coin.active {
    opacity: 1;
  }

  .coin:not(.active):not(.previous) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .coin.overflow {
    background-color: #d32f2f !important;
  }

  .coin.dead {
    background-color: black !important;
  }

  .coin-stack:nth-last-of-type(even) {
    padding-right: 0.5em;
  }

  .coin-stack:nth-last-of-type(odd) {
    padding-left: 0.5em;
  }

  .coin-stack {
    position: relative;
    padding-top: 0.1em;
  }

  .coin-stack::before {
    content: "";
    position: absolute;
    left: 3.1em;
    top: 0.05em;
    width: 1em;
    height: 1px;
    background-color: #fff;
  }

  .coin-stack::after {
    content: attr(data-value);
    position: absolute;
    left: 4em;
    top: 0.2em;
    font-size: 0.9em;
    font-weight: 600;
  }

  .coin-stack-group {
    margin-bottom: 0.5em;
  }

  .coin-group-200 .coin {
    height: 0.41em;
    background-color: #f1fbfd;
  }

  .coin-group-100 .coin {
    height: 0.453em;
    background-color: #fdf1c7;
  }

  .coin-group-50 .coin {
    height: 0.453em;
    background-color: #e4d182;
  }

  .coin-group-20 .coin {
    height: 0.41em;
    background-color: #e4d182;
  }

  .coin-group-10 .coin {
    height: 0.373em;
    background-color: #e4d182;
  }

  .coin-group-5 .coin {
    height: 0.313em;
    background-color: #f3c1a0;
  }

  .coin-group-2 .coin {
    height: 0.31em;
    background-color: #f3c1a0;
  }

  .coin-group-1 .coin {
    height: 0.31em;
    background-color: #f3c1a0;
  }

  .coin-group-sum {
    position: relative;
    line-height: 1.1em;
    height: 1.1em;

    & > span:first-of-type {
      position: absolute;
      left: 0;
      width: 3em;
      text-align: center;
    }

    & > span:last-of-type {
      position: absolute;
      right: 0;
      font-size: 0.8em;
    }
  }
`;

type SuperscriptIndex =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
const superscriptMap = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

export const CoinBox = () => {
  const coinBox = useDashboardSelector((state) => state.registerState.coinBox);
  const previousCoinBox = useDashboardSelector(
    (state) => state.registerState.previous?.coinBox
  );
  const dispatch = useDashboardDispatch();

  const [selectedGroup, setSelectedGroup] = useState<{
    cents: number;
    count: number;
    top: number;
    height: number;
    offset: number;
    hasMoved: boolean;
  } | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const getCoinCount = (cents: number) => {
    switch (cents) {
      case 200:
        return coinBox.coin200;
      case 100:
        return coinBox.coin100;
      case 50:
        return coinBox.coin50;
      case 20:
        return coinBox.coin20;
      case 10:
        return coinBox.coin10;
      case 5:
        return coinBox.coin5;
      case 2:
        return coinBox.coin2;
      case 1:
        return coinBox.coin1;
    }
    return 0;
  };

  const setCoinCount = (cents: number, count: number) => {
    if (isNaN(count) || !isFinite(count)) {
      count = 0;
    }

    switch (cents) {
      case 200:
        dispatch(setCoin200(count));
        break;
      case 100:
        dispatch(setCoin100(count));
        break;
      case 50:
        dispatch(setCoin50(count));
        break;
      case 20:
        dispatch(setCoin20(count));
        break;
      case 10:
        dispatch(setCoin10(count));
        break;
      case 5:
        dispatch(setCoin5(count));
        break;
      case 2:
        dispatch(setCoin2(count));
        break;
      case 1:
        dispatch(setCoin1(count));
        break;
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    const target: HTMLDivElement = event.target as HTMLDivElement;
    target.setPointerCapture(event.pointerId);

    if (previousCoinBox) return;
    let currentElement: HTMLElement | null = event.target as HTMLElement;
    let targetCents = 0;
    let targetCentCount = 0;
    let targetTop = 0;
    let targetHeight = 0;

    while (currentElement !== null) {
      if (currentElement.classList.contains("coin-stack-group")) {
        let box = currentElement.getBoundingClientRect();
        targetTop = box.top;
        targetHeight = box.height;
        targetCentCount = currentElement.getElementsByClassName("coin").length;
      }
      if (currentElement.classList.contains("coin-group")) {
        targetCents = parseInt(currentElement.dataset["value"] ?? "0");
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (targetCents !== 0 && targetHeight !== 0) {
      let currentCount = getCoinCount(targetCents);
      let newCount =
        targetCentCount -
        Math.round(
          ((event.clientY - targetTop) / targetHeight) * targetCentCount
        );

      setSelectedGroup({
        cents: targetCents,
        count: targetCentCount,
        top: targetTop,
        height: targetHeight,
        offset: newCount - currentCount,
        hasMoved: false,
      });

      setTimer(
        setTimeout(function () {
          setSelectedGroup({
            cents: targetCents,
            count: targetCentCount,
            top: targetTop,
            height: targetHeight,
            offset: 0,
            hasMoved: false,
          });
          setCoinCount(targetCents, newCount);
          setTimer(null);
        }, 500)
      );
    }
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (previousCoinBox) return;

    if (selectedGroup) {
      let newCount =
        selectedGroup.count -
        Math.round(
          ((event.clientY - selectedGroup.top) / selectedGroup.height) *
            selectedGroup.count
        ) -
        selectedGroup.offset;

      setCoinCount(selectedGroup.cents, newCount);
      if (selectedGroup.count != newCount) {
        if (timer) {
          clearTimeout(timer);
          setTimer(null);
        }
        setSelectedGroup((g) => {
          if (!g) {
            return null;
          }
          return {
            ...g,
            hasMoved: true,
          };
        });
      }
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (previousCoinBox) return;

    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }

    if (selectedGroup) {
      if (!selectedGroup.hasMoved) {
        let currentElement: HTMLElement | null = event.target as HTMLElement;
        let targetCents = 0;
        let targetCentCount = 0;
        let targetTop = 0;
        let targetHeight = 0;

        while (currentElement !== null) {
          if (currentElement.classList.contains("coin-stack-group")) {
            let box = currentElement.getBoundingClientRect();
            targetTop = box.top;
            targetHeight = box.height;
            targetCentCount =
              currentElement.getElementsByClassName("coin").length;
          }
          if (currentElement.classList.contains("coin-group")) {
            targetCents = parseInt(currentElement.dataset["value"] ?? "0");
            break;
          }
          currentElement = currentElement.parentElement;
        }

        if (targetCents !== 0 && targetHeight !== 0) {
          let newCount =
            targetCentCount -
            Math.round(
              ((event.clientY - targetTop) / targetHeight) * targetCentCount
            );
          setCoinCount(targetCents, newCount);
        }
      }

      setSelectedGroup(null);
    }
  };

  return (
    <StyledCoinBox
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div>
        <CoinGroup
          name="2 EURO"
          stackCount={12}
          centValue={200}
          count={coinBox.coin200}
          previousCount={previousCoinBox?.coin200 ?? 0}
        />
      </div>

      <div>
        <CoinGroup
          name="1 EURO"
          stackCount={11}
          centValue={100}
          count={coinBox.coin100}
          previousCount={previousCoinBox?.coin100 ?? 0}
        />
      </div>

      <div>
        <CoinGroup
          name="50 CENT"
          stackCount={11}
          centValue={50}
          count={coinBox.coin50}
          previousCount={previousCoinBox?.coin50 ?? 0}
        />
      </div>

      <div>
        <CoinGroup
          name="20 CENT"
          stackCount={12}
          centValue={20}
          count={coinBox.coin20}
          previousCount={previousCoinBox?.coin20 ?? 0}
        />
      </div>

      <div>
        <CoinGroup
          name="10 CENT"
          stackCount={13}
          centValue={10}
          count={coinBox.coin10}
          previousCount={previousCoinBox?.coin10 ?? 0}
        />
      </div>

      <div>
        <CoinGroup
          name="5 CENT"
          stackCount={15}
          centValue={5}
          count={coinBox.coin5}
          previousCount={previousCoinBox?.coin5 ?? 0}
        />
      </div>

      <div>
        <CoinGroup
          name="2 CENT"
          stackCount={6}
          centValue={2}
          count={coinBox.coin2}
          previousCount={previousCoinBox?.coin2 ?? 0}
        />
        <CoinGroup
          name="1 CENT"
          stackCount={7}
          centValue={1}
          count={coinBox.coin1}
          previousCount={previousCoinBox?.coin1 ?? 0}
        />
      </div>
    </StyledCoinBox>
  );
};

const CoinGroup = (props: {
  name: string;
  stackCount: number;
  centValue: number;
  count: number;
  previousCount: number;
}) => {
  const maxCoinIndex = props.stackCount * 5;

  const createCoinStack = (stackIndex: number) =>
    Array.from({ length: 5 }, (_, invCoinIndex) => {
      const coinIndex = maxCoinIndex - (stackIndex * 5 + invCoinIndex);
      let classList = "coin";

      if (coinIndex <= props.count) {
        classList += " active";
      }
      if (coinIndex + maxCoinIndex <= props.count) {
        classList += " overflow";
      }
      if (2 * maxCoinIndex <= props.count) {
        classList += " dead";
      }
      if (coinIndex <= props.previousCount) {
        classList += " previous";
      }
      return <span key={coinIndex} className={classList}></span>;
    });
  const stacks = Array.from({ length: props.stackCount }, (_, stackIndex) => {
    const value = (props.centValue * 5 * (props.stackCount - stackIndex))
      .toString()
      .padStart(3, "0");
    let supValue = value.substr(0, value.length - 2);

    if (!value.endsWith("00")) {
      supValue =
        supValue +
        superscriptMap[value[value.length - 2] as SuperscriptIndex] +
        superscriptMap[value[value.length - 1] as SuperscriptIndex];
    }

    return (
      <div className="coin-stack" key={stackIndex} data-value={supValue}>
        {createCoinStack(stackIndex)}
      </div>
    );
  });

  return (
    <div
      className={"coin-group coin-group-" + props.centValue}
      data-value={props.centValue}
    >
      <span>{props.name}</span>
      <div className="coin-stack-group">{stacks}</div>
      <div className="coin-group-sum">
        <span>{props.count}</span>
        <span>{moneyToString(props.count * props.centValue)}</span>
      </div>
    </div>
  );
};
