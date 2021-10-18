import React from 'react';
import { MdCoffee, MdLiquor } from 'react-icons/md';
import Money from '../components/Money';
import { StampType } from '../types/graphql-global';
import './QuickAccess.scss';

interface QuickAccessEntry {
  name: string;
  icon: any;
  price?: number;
  payWithStamps?: StampType;
  giveStamps?: StampType;
}

const entries: QuickAccessEntry[] = [
  {
    name: 'Flasche 0,5l',
    icon: <></>,
    price: 150,
  },
  {
    name: 'Flasche 0,33l',
    icon: <></>,
    price: 110,
  },
  {
    name: 'Flasche Bonus',
    icon: <></>,
    payWithStamps: StampType.BOTTLE,
  },
  {
    name: 'Flasche Rückgabe',
    icon: <></>,
    giveStamps: StampType.BOTTLE,
  },
  {
    name: 'Tasse Rückgabe',
    icon: <></>,
    price: -100,
  },
  {
    name: 'Kaffee Bonus',
    icon: <></>,
    price: 80,
    payWithStamps: StampType.COFFEE,
  },
  {
    name: 'Kaffee',
    icon: <></>,
    price: 80,
    giveStamps: StampType.COFFEE,
  },
  {
    name: 'Milchkaffee',
    icon: <></>,
    price: 100,
    giveStamps: StampType.COFFEE,
  },
  {
    name: 'Großer Latte',
    icon: <></>,
    price: 120,
    giveStamps: StampType.COFFEE,
  },
  {
    name: 'Tassenpfand',
    icon: <></>,
    price: 100,
  },
  {
    name: 'Kaffeestempel',
    icon: <></>,
    giveStamps: StampType.COFFEE,
  },
  {
    name: 'Eigener Becher',
    icon: <></>,
    price: -10,
  },
];

export default function QuickAccess() {
  const content = entries.map((entry, index) => <QuickAccessEntry key={index} entry={entry} />);

  return <div className="quick-access">{content}</div>;
}

function QuickAccessEntry(props: { entry: QuickAccessEntry }) {
  let stamps: any[] = [];
  if (props.entry.payWithStamps === StampType.COFFEE) {
    stamps.push(
      <div key="coffee-10">
        <MdCoffee />
        <span>-10</span>
      </div>
    );
  } else if (props.entry.payWithStamps === StampType.BOTTLE) {
    stamps.push(
      <div key="bottle-10">
        <MdLiquor />
        <span>-10</span>
      </div>
    );
  }

  if (props.entry.giveStamps === StampType.COFFEE) {
    stamps.push(
      <div key="coffee+1">
        <MdCoffee />
        <span>+1</span>
      </div>
    );
  } else if (props.entry.giveStamps === StampType.BOTTLE) {
    stamps.push(
      <div key="bottle+1">
        <MdLiquor />
        <span>+1</span>
      </div>
    );
  }

  return (
    <div className="quick-access-entry">
      <div className="quick-access-entry-name">{props.entry.name}</div>
      <div className="quick-access-entry-icon">{props.entry.icon}</div>
      <div className="quick-access-entry-price">
        <Money value={props.entry.price ?? 0} />
      </div>
      <div className="quick-access-entry-stamps">{stamps}</div>
    </div>
  );
}
