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

function dateToGrouping(date: Date): number {
  date.setUTCHours(2, 0, 0, 0);
  return date.getTime();
}

function transactionToGrouping(transaction: TransactionDto): number {
  return dateToGrouping(new Date(transaction.timestamp));
}

export const GlobalTransactionChart = (props: {
  transactions: TransactionDto[];
  previousTransactions: TransactionDto[];
  startDate?: Date | null;
  endDate?: Date | null;
  onRequestZoom: (startDate: Date, endDate: Date) => void;
}) => {
  const theme = useTheme();
  let groupedTransactions = new Map<number, TransactionDto[]>();

  let previousUpCent = 0;
  let previousDownCent = 0;

  for (let transaction of props.previousTransactions) {
    for (let item of transaction.items) {
      if (item.effective_price.Cent && item.effective_price.Cent > 0) {
        previousDownCent -= item.effective_price.Cent;
      }
      if (item.effective_price.Cent && item.effective_price.Cent < 0) {
        previousUpCent -= item.effective_price.Cent;
      }
    }
  }

  const timeDiff = 24 * 60 * 60 * 1000;

  let minKey = props.startDate ? props.startDate.getTime() : Date.now();
  let maxKey = props.endDate ? props.endDate.getTime() : Date.now();

  for (let transaction of props.transactions) {
    let key = transactionToGrouping(transaction);

    if (key < minKey) {
      minKey = key;
    }
    if (key > maxKey) {
      maxKey = key;
    }

    if (!groupedTransactions.has(key)) {
      groupedTransactions.set(key, []);
    }
    groupedTransactions.get(key)?.push(transaction);
  }

  let minDate = new Date(minKey);
  if (minDate.getFullYear() < 2020) {
    minDate.setFullYear(2022);
    minKey = minDate.getTime();
  }

  minKey = dateToGrouping(new Date(minKey));
  maxKey = dateToGrouping(new Date(maxKey));

  let keys = [...groupedTransactions.keys()];
  keys.sort();

  let upSeries: SeriesData[] = [];
  let downSeries: SeriesData[] = [];
  let sumSeries: SeriesData[] = [];

  let totalUpCent = 0;
  let totalDownCent = 0;

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

    totalUpCent += up;
    totalDownCent += down;

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
      y: previousUpCent + totalUpCent + previousDownCent + totalDownCent,
    });
  }

  let series = [
    {
      name: "Total deposit",
      type: "column",
      data: upSeries,
    },
    {
      name: "Total payout",
      type: "column",
      data: downSeries,
    },
    {
      name: "System balance",
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
