import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TransactionDto } from "../../../common/contracts";
import { useTheme } from "@mui/material";
import styled from "@emotion/styled";

const StyledChart = styled.div`
  .coin-amount-view {
    display: flex;
  }
`;

type SeriesData = {
  x: Date;
  y: number;
};

export const GlobalTransactionChart = (props: {
  transactions: TransactionDto[];
}) => {
  const theme = useTheme();
  let groupedTransactions = new Map<number, TransactionDto[]>();

  const timeDiff = 24 * 60 * 60 * 1000;

  function toGrouping(transaction: TransactionDto): number {
    let date = new Date(transaction.timestamp);
    date.setUTCHours(2, 0, 0, 0);
    return date.getTime();
  }

  let minKey = Date.now();
  let maxKey = minKey;

  for (let transaction of props.transactions) {
    let key = toGrouping(transaction);

    if (key < minKey) {
      minKey = key;
    }

    if (!groupedTransactions.has(key)) {
      groupedTransactions.set(key, []);
    }
    groupedTransactions.get(key)?.push(transaction);
  }

  let keys = [...groupedTransactions.keys()];
  keys.sort();

  let upSeries: SeriesData[] = [];
  let downSeries: SeriesData[] = [];
  let sumSeries: SeriesData[] = [];

  for (let key = minKey; key <= maxKey; key += timeDiff) {
    let date = new Date(key);
    let transactions = groupedTransactions.get(key) ?? [];

    let up = 0;
    let down = 0;

    for (let transaction of transactions) {
      for (let item of transaction.items) {
        if (item.effective_price.Cent && item.effective_price.Cent > 0) {
          down -= item.effective_price.Cent;
        }
        if (item.effective_price.Cent && item.effective_price.Cent < 0) {
          up -= item.effective_price.Cent;
        }
      }
    }

    upSeries.push({
      x: date,
      y: up,
    });
    downSeries.push({
      x: date,
      y: down,
    });
    sumSeries.push({
      x: date,
      y: up + down,
    });
  }

  let series = [
    {
      name: "Up",
      type: "column",
      data: upSeries,
    },
    {
      name: "Down",
      type: "column",
      data: downSeries,
    },
    {
      name: "Sum",
      type: "line",
      data: sumSeries,
    },
  ];

  let options: ApexOptions = {
    theme: {
      mode: theme.palette.mode,
    },
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
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
    },
  };

  return (
    <StyledChart>
      <Chart options={options} series={series} height={350} />
    </StyledChart>
  );
};
