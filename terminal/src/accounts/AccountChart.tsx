import React from 'react';
import { LineConfig } from '@ant-design/charts/es/plots/line';
import { Line } from '@ant-design/charts';
import { moneyToString } from '../components/Money';
import { StampType } from '../types/graphql-global';

export type DiagramData = {
  id: UUID;
  total: number;
  beforeCredit: number;
  afterCredit: number;
  coffeeStamps: number;
  beforeCoffeeStamps: number;
  afterCoffeeStamps: number;
  bottleStamps: number;
  beforeBottleStamps: number;
  afterBottleStamps: number;
  date: number;
  items: {
    price: number;
    payWithStamps: StampType;
    giveStamps: StampType;
    product: {
      id: UUID;
      name: string;
      price: number;
      payWithStamps: StampType;
      giveStamps: StampType;
      image: string | null;
      category: {
        name: string;
      };
    } | null;
  }[];
};

const BLUE = '#2980b9';
const RED = '#c0392b';

export default function AccountChart({ diagramData }: { diagramData: DiagramData[] }) {
  const config: LineConfig = {
    data: diagramData,
    height: 380,
    width: 704,
    xField: 'date',
    yField: 'afterCredit',
    color: BLUE,
    stepType: 'hv',
    meta: {
      date: {
        type: 'time',
      },
    },
    annotations: [
      {
        type: 'regionFilter',
        start: ['min', 'min'] as [number | string, number | string],
        end: ['max', '0'] as [number | string, number | string],
        color: RED,
      },
    ],
    xAxis: {
      label: {
        formatter: (value: any) => {
          return value;
        },
      },
    },
    yAxis: {
      label: {
        formatter: (value: any) => {
          return moneyToString(value);
        },
      },
    },
    tooltip: {
      customContent: () => {
        return (<></>) as unknown as HTMLElement;
      },
    },
  };

  return <Line {...config} />;
}
