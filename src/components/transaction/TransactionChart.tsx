import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  AccountDto,
  CoinAmountDto,
  TransactionDto,
} from "../../redux/api/contracts";
import { renderToString } from "react-dom/server";
import { addCoinAmount, getTransactionSum } from "./transactionUtils";
import { Theme, useTheme } from "@mui/material";
import { CoinAmountView } from "./CoinAmountView";

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
}) => {
  const theme = useTheme();
  const format = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  let sortedTransactions = [...props.transactions];
  sortedTransactions.reverse();

  let seriesData: SeriesData[] = [];

  let latest: SeriesData = {
    x: new Date(),
    y: props.account.balance.Cent ?? 0,
    price: {},
    beforeBalance: props.account.balance,
    afterBalance: props.account.balance,
    isStatic: true,
  };
  seriesData.push(latest);

  let min = props.account.balance.Cent ?? 0;
  let max = props.account.balance.Cent ?? 0;

  for (let transaction of sortedTransactions) {
    let price = getTransactionSum(transaction);
    let afterBalance = latest.beforeBalance;
    let beforeBalance = addCoinAmount(afterBalance, price);
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
    x: new Date(latest.x.getTime() - 60 * 60 * 1000),
    y: 0,
    price: {},
    beforeBalance: {},
    afterBalance: {},
    isStatic: true,
  });

  seriesData.reverse();

  let series = [
    {
      data: seriesData,
    },
  ];
  let options: ApexOptions = {
    theme: {
      mode: theme.palette.mode,
    },
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      background: "transparent",
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
                items={[{ name: "Balance", coins: entry.afterBalance }]}
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
                { name: "Price", coins: entry.price },
                {
                  name: "Before balance",
                  coins: entry.beforeBalance,
                },
                { name: "After balance", coins: entry.afterBalance },
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
        formatter: function (val: number, opts) {
          return (val / 100).toFixed(2) + " €";
        },
      },
      min: Math.floor((min - 50) / 500) * 500,
      max: Math.ceil((max + 50) / 500) * 500,
    },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
};

const Popup = (props: {
  theme: Theme;
  title?: string;
  items: {
    name: string;
    coins: CoinAmountDto;
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
        {props.items.map((item) => {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{item.name}</span>
              <CoinAmountView coins={item.coins} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
