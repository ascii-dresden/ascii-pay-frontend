import React from 'react';
import { MdCoffee, MdLiquor } from 'react-icons/md';
import Money from '../components/Money';
import { useAppDispatch } from '../store';
import { StampType } from '../types/graphql-global';
import { addPaymentItem } from './paymentSlice';
import './QuickAccess.scss';

interface QuickAccessEntry {
  name: string;
  icon: any;
  price?: number;
  className?: string;
  colorHint?: string;
  couldBePaidWithStamps?: StampType;
  payWithStamps?: StampType;
  giveStamps?: StampType;
}

const entries: QuickAccessEntry[][] = [
  [
    {
      name: 'Kaffee',
      icon: <></>,
      price: 80,
      giveStamps: StampType.COFFEE,
      couldBePaidWithStamps: StampType.COFFEE,
      className: 'group-coffee coffee',
      colorHint: 'coffee',
    },
    {
      name: 'Milch\u00ADkaffee\nKakao',
      icon: <></>,
      price: 100,
      giveStamps: StampType.COFFEE,
      couldBePaidWithStamps: StampType.COFFEE,
      className: 'group-coffee milk-coffee',
      colorHint: 'coffee',
    },
    {
      name: 'Großer Latte',
      icon: <></>,
      price: 120,
      giveStamps: StampType.COFFEE,
      couldBePaidWithStamps: StampType.COFFEE,
      className: 'group-coffee large-latte',
      colorHint: 'coffee',
    },
  ],
  [
    {
      name: 'Tassen\u00ADpfand',
      icon: <></>,
      price: 100,
      className: 'group-cup',
      colorHint: 'cup',
    },
    {
      name: 'Tassen\u00ADrückgabe',
      icon: <></>,
      price: -100,
      className: 'group-cup',
      colorHint: 'cup',
    },
    {
      name: 'Eigener Becher',
      icon: <></>,
      price: -10,
      className: 'group-cup',
      colorHint: 'cup',
    },
  ],
  [
    {
      name: 'Flasche 0,33l BIO\nFlasche 0,5l',
      icon: <></>,
      price: 150,
      couldBePaidWithStamps: StampType.BOTTLE,
      className: 'group-bottle bottle-150',
      colorHint: 'bottle',
    },
    {
      name: 'Flasche 0,33l',
      icon: <></>,
      price: 110,
      couldBePaidWithStamps: StampType.BOTTLE,
      className: 'group-bottle bottle-110',
      colorHint: 'bottle',
    },
  ],
  [
    {
      name: 'Flaschen\u00ADstempel',
      icon: <></>,
      giveStamps: StampType.BOTTLE,
      className: 'group-stamp bottle-stamp',
    },
    {
      name: 'Gratis Flasche',
      icon: <></>,
      payWithStamps: StampType.BOTTLE,
      className: 'group-stamp bottle-free',
    },
    {
      name: 'Kaffee\u00ADstempel',
      icon: <></>,
      giveStamps: StampType.COFFEE,
      className: 'group-stamp coffee-stamp',
    },
    {
      name: 'Gratis Kaffee',
      icon: <></>,
      payWithStamps: StampType.COFFEE,
      className: 'group-stamp coffee-free',
    },
  ],
];

export default function QuickAccess() {
  const content = entries.map((row, rowIndex) => {
    let x = row.map((entry, entryIndex) => <QuickAccessEntryView key={entryIndex} entry={entry} />);
    return (
      <div className="quick-access-row" key={rowIndex}>
        {x}
      </div>
    );
  });

  return <div className="quick-access">{content}</div>;
}

function QuickAccessEntryView(props: { entry: QuickAccessEntry }) {
  const dispatch = useAppDispatch();

  let stemp: any | null = null;
  if (props.entry.payWithStamps === StampType.COFFEE) {
    stemp = (
      <div key="coffee-10" className="quick-access-entry-stamp">
        <MdCoffee />
        <span>-10</span>
      </div>
    );
  } else if (props.entry.payWithStamps === StampType.BOTTLE) {
    stemp = (
      <div key="bottle-10" className="quick-access-entry-stamp">
        <MdLiquor />
        <span>-10</span>
      </div>
    );
  }
  if (props.entry.giveStamps === StampType.COFFEE) {
    stemp = <img id="sidebar-ascii-logo" src="/favicon.svg" alt="" />;
  } else if (props.entry.giveStamps === StampType.BOTTLE) {
    stemp = <img id="sidebar-ascii-logo" src="/favicon.svg" alt="" />;
  }

  let center: any | null = null;
  let extra: any | null = null;

  if (props.entry.price) {
    center = <Money value={props.entry.price} />;
    extra = stemp;
  } else {
    center = stemp;
  }

  const onClick = () => {
    dispatch(
      addPaymentItem({
        price: props.entry.price ?? 0,
        payWithStamps: props.entry.payWithStamps ?? StampType.NONE,
        couldBePaidWithStamps: props.entry.couldBePaidWithStamps ?? StampType.NONE,
        giveStamps: props.entry.giveStamps ?? StampType.NONE,
        product: null,
        nameHint: props.entry.name,
        colorHint: props.entry.colorHint,
      })
    );
  };

  return (
    <div className={'quick-access-entry ' + (props.entry.className ?? '')} onClick={onClick}>
      <div className="quick-access-entry-name">{props.entry.name}</div>
      {center ? <div className="quick-access-entry-center">{center}</div> : null}
      {extra ? <div className="quick-access-entry-extra">{extra}</div> : null}
    </div>
  );
}
