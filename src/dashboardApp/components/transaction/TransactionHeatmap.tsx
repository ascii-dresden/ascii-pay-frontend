import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { TransactionDto } from "../../../common/contracts";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import styled from "@emotion/styled";
import { dateToGrouping } from "./GlobalTransactionChart";
import { renderToString } from "react-dom/server";
import { moneyToString } from "../../../terminalApp/components/Money";
import { useTranslation } from "react-i18next";

const StyledChart = styled.div`
  .coin-amount-view {
    display: flex;
  }
`;

type SeriesData = {
  x: string;
  date: Date;
  y: number;
  up: number;
  down: number;
  count: number;
};

function splitToWeekDay(date: Date): {
  week: string;
  day: number;
} {
  // Source: https://weeknumber.com/how-to/javascript
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(d.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  const weekNumber =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );

  const day = date.getDay();
  return {
    week: `${d.getFullYear()}-${weekNumber}`,
    day: day == 0 ? 6 : day - 1,
  };
}

function transactionToGrouping(transaction: TransactionDto): number {
  return dateToGrouping(new Date(transaction.timestamp));
}

export const TransactionHeatmap = (props: {
  transactions: TransactionDto[];
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  let groupedTransactions = new Map<number, TransactionDto[]>();

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

  let startSplit = splitToWeekDay(new Date(minKey));
  if (startSplit.day > 0) {
    minKey -= timeDiff * startSplit.day;
  }
  let endSplit = splitToWeekDay(new Date(maxKey));
  if (endSplit.day < 6) {
    maxKey += timeDiff * (6 - endSplit.day);
  }

  let series: { name: string; data: SeriesData[] }[] = [
    {
      name: isMobile ? t("date.compact.monday") : t("date.monday"),
      data: [],
    },
    {
      name: isMobile ? t("date.compact.tuesday") : t("date.tuesday"),
      data: [],
    },
    {
      name: isMobile ? t("date.compact.wednesday") : t("date.wednesday"),
      data: [],
    },
    {
      name: isMobile ? t("date.compact.thursday") : t("date.thursday"),
      data: [],
    },
    {
      name: isMobile ? t("date.compact.friday") : t("date.friday"),
      data: [],
    },
    {
      name: isMobile ? t("date.compact.saturday") : t("date.saturday"),
      data: [],
    },
    {
      name: isMobile ? t("date.compact.sunday") : t("date.sunday"),
      data: [],
    },
  ];

  let maxSum = 0;

  for (let key = minKey; key <= maxKey; key += timeDiff) {
    let date = new Date(key);
    let { week, day } = splitToWeekDay(date);
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
    let sum = up / 10 - down;

    if (sum > maxSum) {
      maxSum = sum;
    }

    series[day].data.push({
      x: week,
      date: date,
      y: sum,
      up: up,
      down: down,
      count: transactions.length,
    });
  }

  if (maxSum > 0) {
    for (let s of series) {
      for (let d of s.data) {
        d.y = ease(d.y / maxSum);
      }
    }
  }
  series.reverse();

  let options: ApexOptions = {
    theme: {
      mode: theme.palette.mode,
    },
    dataLabels: {
      enabled: false,
    },
    chart: {
      type: "heatmap",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: false,
      },
      background: "transparent",
    },
    markers: {
      hover: {
        sizeOffset: 4,
      },
    },
    tooltip: {
      shared: false,
      custom: function ({ seriesIndex, dataPointIndex }) {
        let entry = series[seriesIndex].data[dataPointIndex];

        return renderToString(
          <div className="arrow_box">
            <Popup theme={theme} entry={entry} />
          </div>
        );
      },
    },
    colors: [
      theme.palette.mode === "light"
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
    ],
  };

  return (
    <StyledChart>
      <Chart options={options} series={series} height={350} type="heatmap" />
    </StyledChart>
  );
};

function ease(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
});

const Popup = (props: { theme: Theme; entry: SeriesData }) => {
  const bg = props.theme.palette.background.default;
  const fg = props.theme.palette.text.primary;
  const d = props.theme.palette.divider;

  let date = format.format(props.entry.date);

  return (
    <div style={{ backgroundColor: bg, color: fg }}>
      <div
        style={{
          padding: "0.8rem 1rem 0.5rem",
          fontWeight: "bold",
          borderBottom: `solid 1px ${d}`,
        }}
      >
        {date}
      </div>
      <div
        style={{
          padding: "0.5rem 1rem 0.8rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Deposit</span>
          <span>{moneyToString(props.entry.up)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Payout</span>
          <span>{moneyToString(props.entry.down)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Transaction count</span>
          <span>{props.entry.count}</span>
        </div>
      </div>
    </div>
  );
};
