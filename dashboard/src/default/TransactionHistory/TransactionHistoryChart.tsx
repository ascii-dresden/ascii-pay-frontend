import { LineConfig } from '@ant-design/charts/es/plots/line';
import { Line } from '@ant-design/charts';
import React from 'react';
import { blue, red } from '@ant-design/colors';
import moment from 'moment';

export type DiagramData = {
  renderTooltip: boolean;
  id: string;
  total: number;
  beforeCredit: number;
  afterCredit: number;
  date: number;
  products: {
    product: {
      id: string;
      name: string;
      currentPrice: number;
    };
    amount: number;
  }[];
};

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export function TransactionHistoryChart({ diagramData }: { diagramData: DiagramData[] }) {
  const config: LineConfig = {
    data: diagramData,
    height: 300,
    xField: 'date',
    yField: 'afterCredit',
    color: blue[5],
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
        color: red[5],
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
          return ((value * 1.0) / 100).toFixed(2) + '€';
        },
      },
    },
    tooltip: {
      customContent: (title: string, items: any) => {
        if (items.length <= 0) {
          return (<></>) as unknown as HTMLElement;
        }
        let item = items[0];
        if (!item.data.renderTooltip) {
          if (item.data.id === 'from') {
            return (
              <>
                <div className="g2-tooltip-title">{moment(item.data.date).format(dateTimeFormat)}</div>
                <ul className="g2-tooltip-list">
                  <li className="g2-tooltip-list-item" data-index="">
                    <span className="g2-tooltip-marker"></span>
                    <span className="g2-tooltip-name">Balance</span>:
                    <span className="g2-tooltip-value">{((item.data.afterCredit * 1.0) / 100).toFixed(2)}€</span>
                  </li>
                </ul>
              </>
            ) as unknown as HTMLElement;
          }
          if (item.data.id === 'to') {
            return (
              <>
                <div className="g2-tooltip-title">{moment(item.data.date).format(dateTimeFormat)}</div>
                <ul className="g2-tooltip-list">
                  <li className="g2-tooltip-list-item" data-index="">
                    <span className="g2-tooltip-marker"></span>
                    <span className="g2-tooltip-name">Balance</span>:
                    <span className="g2-tooltip-value">{((item.data.afterCredit * 1.0) / 100).toFixed(2)}€</span>
                  </li>
                </ul>
              </>
            ) as unknown as HTMLElement;
          }

          return (<></>) as unknown as HTMLElement;
        }
        return (
          <>
            <div className="g2-tooltip-title">{moment(item.data.date).format(dateTimeFormat)}</div>
            <ul className="g2-tooltip-list">
              <li className="g2-tooltip-list-item" data-index="">
                <span className="g2-tooltip-marker" style={{ backgroundColor: item.color }}></span>
                <span className="g2-tooltip-name">Price</span>:
                <span className="g2-tooltip-value">{((item.data.total * 1.0) / 100).toFixed(2)}€</span>
              </li>
              <li className="g2-tooltip-list-item" data-index="">
                <span className="g2-tooltip-marker"></span>
                <span className="g2-tooltip-name">Balance</span>:
                <span className="g2-tooltip-value">{((item.data.afterCredit * 1.0) / 100).toFixed(2)}€</span>
              </li>
            </ul>
          </>
        ) as unknown as HTMLElement;
      },
    },
  };

  return <Line {...config} />;
}
