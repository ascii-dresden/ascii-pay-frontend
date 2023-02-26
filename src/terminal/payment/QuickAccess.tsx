import React from "react";
import { Money } from "../components/Money";
import { CoinAmountDto } from "../../redux/api/contracts";
import { useAppDispatch } from "../../redux/store";
import { CoffeeStamp } from "../../components/CoffeeStamp";
import { BottleStamp } from "../../components/BottleStamp";
import { addPaymentItem } from "../../redux/features/paymentSlice";
import { selectNextCoinAmount } from "../../components/transaction/transactionUtils";
import styled from "@emotion/styled";

const StyledQuickAccess = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  padding: 0.6em;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
`;

const StyledQuickAccessRow = styled.div`
  display: flex;
  flex: 1 1 0px;
  gap: 0.6em;

  &:last-child {
    flex-grow: 0.9;
  }
`;

const StyledQuickAccessEntry = styled.div`
  flex: 1 1 0px;
  padding: 0.5em;

  position: relative;
  background-color: var(--primary-background);
  border: solid 1px var(--border-color);

  &:hover {
    background-color: var(--primary-hover-background);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  img {
    width: 1.2em;
    height: 1.2em;
  }

  &.group-bottle::before {
    background: linear-gradient(
      155deg,
      rgba(0, 0, 0, 0) 75%,
      var(--bottle-color) 75%,
      var(--bottle-color) 100%
    );
  }

  &.group-stamp {
    border-radius: 100%;
    border-width: 4px;

    .quick-access-entry-name {
      top: 12% !important;
    }

    .quick-access-entry-center {
      top: 30% !important;
    }
  }

  &.group-coffee::before {
    background: linear-gradient(
      155deg,
      rgba(0, 0, 0, 0) 75%,
      var(--coffee-color) 75%,
      var(--coffee-color) 100%
    );
  }

  &.group-cup::before {
    background: linear-gradient(
      155deg,
      rgba(0, 0, 0, 0) 75%,
      var(--cup-color) 75%,
      var(--cup-color) 100%
    );
  }

  &.bottle-stamp,
  &.bottle-free {
    border-color: var(--bottle-color);
  }

  &.coffee-stamp,
  &.coffee-free {
    border-color: var(--coffee-color);
  }

  &.dark {
    img {
      filter: invert(1);
    }
  }
`;

const StyledQuickAccessEntryCenter = styled.div`
  position: absolute;
  left: 0;
  top: 15%;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
`;

const StyledQuickAccessEntryExtra = styled.div`
  position: absolute;
  right: -0.4em;
  bottom: -0.4em;
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  border-radius: 100%;
  z-index: 1;

  span {
    display: none;
  }

  .quick-access-entry-stamp img {
    margin-left: 0em !important;
  }
`;
const StyledQuickAccessEntryName = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0.5em;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-size: 0.9em;
  text-align: center;
`;
const StyledQuickAccessEntryStamp = styled.div`
  display: flex;
  align-items: center;

  img {
    margin-left: 0.4em;
  }
`;

interface QuickAccessEntry {
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  icon: React.ReactNode;
  className?: string;
  colorHint?: string;
}

const entries: QuickAccessEntry[][] = [
  [
    {
      name: "Kaffee",
      price: {
        Cent: 100,
        CoffeeStamp: 10,
      },
      bonus: {
        CoffeeStamp: 1,
      },
      icon: <></>,
      className: "group-coffee coffee",
      colorHint: "coffee",
    },
    {
      name: "Milch\u00ADkaffee\nKakao",
      price: {
        Cent: 150,
        CoffeeStamp: 10,
      },
      bonus: {
        CoffeeStamp: 1,
      },
      icon: <></>,
      className: "group-coffee milk-coffee",
      colorHint: "coffee",
    },
    {
      name: "Großer Latte",
      icon: <></>,
      price: {
        Cent: 200,
        CoffeeStamp: 10,
      },
      bonus: {
        CoffeeStamp: 1,
      },
      className: "group-coffee large-latte",
      colorHint: "coffee",
    },
  ],
  [
    {
      name: "Tassen\u00ADpfand",
      price: {
        Cent: 100,
      },
      bonus: {},
      icon: <></>,
      className: "group-cup",
      colorHint: "cup",
    },
    {
      name: "Tassen\u00ADrückgabe",
      price: {},
      bonus: {
        Cent: 100,
      },
      icon: <></>,
      className: "group-cup",
      colorHint: "cup",
    },
    {
      name: "Eigener Becher",
      price: {},
      bonus: {
        Cent: 10,
      },
      icon: <></>,
      className: "group-cup",
      colorHint: "cup",
    },
  ],
  [
    {
      name: "Flasche 0,33l BIO\nFlasche 0,5l",
      price: {
        Cent: 150,
        BottleStamp: 10,
      },
      bonus: {},
      icon: <></>,
      className: "group-bottle bottle-150",
      colorHint: "bottle",
    },
    {
      name: "Flasche 0,33l",
      price: {
        Cent: 150,
        BottleStamp: 10,
      },
      bonus: {},
      icon: <></>,
      className: "group-bottle bottle-110",
      colorHint: "bottle",
    },
    {
      name: "Flasche Fritz",
      price: {
        Cent: 200,
        BottleStamp: 10,
      },
      bonus: {},
      icon: <></>,
      className: "group-bottle bottle-200",
      colorHint: "bottle",
    },
  ],
  [
    {
      name: "Flaschen\u00ADstempel",
      price: {},
      bonus: {
        BottleStamp: 1,
      },
      icon: <></>,
      className: "group-stamp bottle-stamp",
    },
    {
      name: "Gratis Flasche",
      price: {
        BottleStamp: 10,
      },
      bonus: {},
      icon: <></>,
      className: "group-stamp bottle-free",
    },
    {
      name: "Kaffee\u00ADstempel",
      price: {},
      bonus: {
        CoffeeStamp: 1,
      },
      icon: <></>,
      className: "group-stamp coffee-stamp",
    },
    {
      name: "Gratis Kaffee",
      price: {
        CoffeeStamp: 10,
      },
      bonus: {},
      icon: <></>,
      className: "group-stamp coffee-free",
    },
  ],
];

export const QuickAccess = () => {
  const content = entries.map((row, rowIndex) => {
    let x = row.map((entry, entryIndex) => (
      <QuickAccessEntryView key={entryIndex} entry={entry} />
    ));
    return <StyledQuickAccessRow key={rowIndex}>{x}</StyledQuickAccessRow>;
  });

  return <StyledQuickAccess>{content}</StyledQuickAccess>;
};

const QuickAccessEntryView = (props: { entry: QuickAccessEntry }) => {
  const dispatch = useAppDispatch();

  let stamp: any | null = null;
  if (props.entry.price.CoffeeStamp && props.entry.price.CoffeeStamp > 0) {
    stamp = (
      <StyledQuickAccessEntryStamp key="coffee-10">
        <span>-{props.entry.price.CoffeeStamp}</span>
        <CoffeeStamp />
      </StyledQuickAccessEntryStamp>
    );
  } else if (
    props.entry.price.BottleStamp &&
    props.entry.price.BottleStamp > 0
  ) {
    stamp = (
      <StyledQuickAccessEntryStamp key="bottle-10">
        <span>-{props.entry.price.BottleStamp}</span>
        <CoffeeStamp />
      </StyledQuickAccessEntryStamp>
    );
  }
  if (props.entry.bonus.CoffeeStamp && props.entry.bonus.CoffeeStamp > 0) {
    stamp = (
      <StyledQuickAccessEntryStamp key="coffee-1">
        <span>+</span>
        <CoffeeStamp />
      </StyledQuickAccessEntryStamp>
    );
  } else if (
    props.entry.bonus.BottleStamp &&
    props.entry.bonus.BottleStamp > 0
  ) {
    stamp = (
      <StyledQuickAccessEntryStamp key="bottle-1">
        <span>+</span>
        <BottleStamp />
      </StyledQuickAccessEntryStamp>
    );
  }

  let center: any | null = null;
  let extra: any | null = null;

  if (props.entry.price) {
    center = (
      <Money
        value={(props.entry.price.Cent ?? 0) + (props.entry.bonus.Cent ?? 0)}
      />
    );
    extra = stamp;
  } else {
    center = stamp;
  }

  const onClick = () => {
    dispatch(
      addPaymentItem({
        product: {
          name: props.entry.name,
          price: props.entry.price,
          bonus: props.entry.bonus,
        },
        effective_price: selectNextCoinAmount(props.entry, {}),
        colorHint: props.entry.colorHint,
      })
    );
  };

  return (
    <StyledQuickAccessEntry className={props.entry.className} onClick={onClick}>
      <StyledQuickAccessEntryName>
        {props.entry.name}
      </StyledQuickAccessEntryName>
      {center ? (
        <StyledQuickAccessEntryCenter>{center}</StyledQuickAccessEntryCenter>
      ) : null}
      {extra ? (
        <StyledQuickAccessEntryExtra>{extra}</StyledQuickAccessEntryExtra>
      ) : null}
    </StyledQuickAccessEntry>
  );
};
