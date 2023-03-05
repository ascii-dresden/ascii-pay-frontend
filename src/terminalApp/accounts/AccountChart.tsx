import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  AccountDto,
  CoinAmountDto,
  TransactionDto,
} from "../../common/contracts";
import {
  addCoinAmount,
  getTransactionSum,
} from "../../common/transactionUtils";
import { TerminalSettings } from "../pages/TerminalSettingsPage";

type SeriesData = {
  x: Date;
  y: number;
  price: CoinAmountDto;
  beforeBalance: CoinAmountDto;
  afterBalance: CoinAmountDto;
  isStatic?: boolean;
};

export const AccountChart = (props: {
  account: AccountDto;
  transactions: TransactionDto[];
  height: number;
  fontSize: number;
  settings: TerminalSettings;
}) => {
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
      mode: props.settings.theme,
    },
    chart: {
      type: "line",
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
      colors: ["var(--theme-color)"],
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: number, opts) {
        let price = seriesData[opts.dataPointIndex].price.Cent ?? 0;
        return (price / 100).toFixed(2) + " €";
      },
    },
    tooltip: {
      enabled: false,
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
    <Chart
      options={options}
      series={series}
      type="line"
      height={props.height - props.fontSize * 7}
    />
  );
};
