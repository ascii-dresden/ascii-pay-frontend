import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  AccountDto,
  CoinAmountDto,
  TransactionDto,
} from "../../../common/contracts";
import { renderToString } from "react-dom/server";
import {
  getTransactionSum,
  subCoinAmount,
} from "../../../common/transactionUtils";
import { Theme, useTheme } from "@mui/material";
import { CoinAmountView } from "./CoinAmountView";
import styled from "@emotion/styled";

const StyledChart = styled.div`
  .coin-amount-view {
    display: flex;
  }
`;

type SeriesData = {
  x: Date;
  y: number;
  price: CoinAmountDto;
  beforeBalance: CoinAmountDto;
  afterBalance: CoinAmountDto;
  isStatic?: boolean;
};

export const TransactionChart = (props: {
  account: AccountDto;
  transactions: TransactionDto[];
  previousTransactions: TransactionDto[];
  startDate?: Date | null;
  endDate?: Date | null;
  onRequestZoom: (startDate: Date, endDate: Date) => void;
}) => {
  const theme = useTheme();
  const format = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  let sortedTransactions = [...props.transactions];
  // sortedTransactions.reverse();

  let seriesData: SeriesData[] = [];

  let latest: SeriesData;
  if (props.previousTransactions.length > 0) {
    let balance: CoinAmountDto = {};
    for (let transaction of props.previousTransactions) {
      let price = getTransactionSum(transaction);
      balance = subCoinAmount(balance, price);
    }

    latest = {
      x: props.startDate ?? new Date(),
      y: balance.Cent ?? 0,
      price: {},
      beforeBalance: balance,
      afterBalance: balance,
      isStatic: true,
    };
  } else {
    latest = {
      x: props.startDate ?? new Date(),
      y: props.account.balance.Cent ?? 0,
      price: {},
      beforeBalance: {},
      afterBalance: {},
      isStatic: true,
    };
  }
  seriesData.push(latest);

  let min = props.account.balance.Cent ?? 0;
  let max = props.account.balance.Cent ?? 0;

  for (let transaction of sortedTransactions) {
    let price = getTransactionSum(transaction);
    let beforeBalance = latest.afterBalance;
    let afterBalance = subCoinAmount(beforeBalance, price);
    latest = {
      x: new Date(transaction.timestamp),
      y: afterBalance.Cent ?? 0,
      price,
      beforeBalance,
      afterBalance,
    };
    seriesData.push(latest);

    if ((beforeBalance.Cent ?? 0) > max) {
      max = beforeBalance.Cent ?? 0;
    }
    if ((beforeBalance.Cent ?? 0) < min) {
      min = beforeBalance.Cent ?? 0;
    }
  }

  seriesData.push({
    x: props.endDate ?? new Date(),
    y: latest.afterBalance.Cent ?? 0,
    price: {},
    beforeBalance: latest.afterBalance,
    afterBalance: latest.afterBalance,
    isStatic: true,
  });

  let series = [
    {
      data: seriesData,
      color:
        theme.palette.mode === "light"
          ? theme.palette.primary.light
          : theme.palette.primary.dark,
    },
  ];
  let options: ApexOptions = {
    theme: {
      mode: theme.palette.mode,
    },
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
      background: "transparent",
      events: {
        beforeZoom(chart: any, options?: any) {
          let start = new Date(options.xaxis.min);
          start.setUTCHours(2, 0, 0, 0);
          let end = new Date(options.xaxis.max);
          end.setUTCHours(2, 0, 0, 0);

          if (props.onRequestZoom) {
            props.onRequestZoom(start, end);
          }

          return {
            xaxis: {
              min: null,
              max: null,
            },
          };
        },
      },
    },
    stroke: {
      curve: "stepline",
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: number, opts) {
        let price = seriesData[opts.dataPointIndex].price.Cent ?? 0;
        return (price / 100).toFixed(2) + " €";
      },
    },
    tooltip: {
      shared: false,
      custom: function ({ dataPointIndex }) {
        let entry = seriesData[dataPointIndex];

        if (entry.isStatic) {
          return renderToString(
            <div className="arrow_box">
              <Popup
                theme={theme}
                items={[
                  {
                    name: "Balance",
                    coins: entry.afterBalance,
                    negativeIsError: true,
                  },
                ]}
              />
            </div>
          );
        }

        let date = format.format(entry.x);
        return renderToString(
          <div className="arrow_box">
            <Popup
              theme={theme}
              title={date}
              items={[
                {
                  name: "Before balance",
                  coins: entry.beforeBalance,
                  negativeIsError: true,
                },
                { name: "Price", coins: entry.price, isTransaction: true },
                {
                  name: "After balance",
                  coins: entry.afterBalance,
                  negativeIsError: true,
                },
              ]}
            />
          </div>
        );
      },
    },
    markers: {
      hover: {
        sizeOffset: 4,
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return (val / 100).toFixed(2) + " €";
        },
      },
      min: Math.floor((min - 50) / 500) * 500,
      max: Math.ceil((max + 50) / 500) * 500,
    },
  };

  return (
    <StyledChart>
      <Chart options={options} series={series} type="line" height={350} />
    </StyledChart>
  );
};

const Popup = (props: {
  theme: Theme;
  title?: string;
  items: {
    name: string;
    coins: CoinAmountDto;
    isTransaction?: boolean;
    negativeIsError?: boolean;
  }[];
}) => {
  const bg = props.theme.palette.background.default;
  const fg = props.theme.palette.text.primary;
  const d = props.theme.palette.divider;

  return (
    <div style={{ backgroundColor: bg, color: fg }}>
      {props.title ? (
        <div
          style={{
            padding: "0.8rem 1rem 0.5rem",
            fontWeight: "bold",
            borderBottom: `solid 1px ${d}`,
          }}
        >
          {props.title}
        </div>
      ) : null}
      <div
        style={{
          padding: props.title ? "0.5rem 1rem 0.8rem" : "0.8rem 1rem",
        }}
      >
        {props.items.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: item.isTransaction ? `solid 1px ${d}` : undefined,
              }}
            >
              <span>{item.name}</span>
              <CoinAmountView
                coins={item.coins}
                isTransaction={item.isTransaction}
                negativeIsError={item.negativeIsError}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
