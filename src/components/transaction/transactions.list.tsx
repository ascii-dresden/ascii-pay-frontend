import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetAllTransactionsQuery } from "../../redux/api/accountApi";
import FullScreenLoader from "../FullScreenLoader";
import TransactionItem, {
  addCoinAmount,
  getTransactionSum,
} from "./transaction.component";
import { CreatePayment } from "./create-payment";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { CoinAmountView } from "../CoinAmountView";
import { AccountDto, CoinAmountDto } from "../../redux/api/contracts";
import { renderToString } from "react-dom/server";

type SeriesData = {
  x: Date;
  y: number;
  price: CoinAmountDto;
  beforeBalance: CoinAmountDto;
  afterBalance: CoinAmountDto;
  isStatic?: boolean;
};

export const TransactionList = (props: { account: AccountDto }) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useGetAllTransactionsQuery(props.account.id);

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || transactions === undefined) {
    return <FullScreenLoader />;
  }

  const format = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "long",
  });

  let sortedTransactions = [...transactions];
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
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: false,
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
              <div>Balance</div>
              <CoinAmountView coins={entry.afterBalance} />
            </div>
          );
        }

        let date = format.format(entry.y);
        return renderToString(
          <div className="arrow_box">
            <div>{date}</div>
            <div>Price</div>
            <CoinAmountView coins={entry.price} />
            <div>Before balance</div>
            <CoinAmountView coins={entry.beforeBalance} />
            <div>After balance</div>
            <CoinAmountView coins={entry.afterBalance} />
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
      min: Math.floor((min - 500) / 500) * 500,
      max: Math.ceil((max + 500) / 500) * 500,
    },
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <CoinAmountView coins={props.account.balance} />
        <div id="chart">
          <Chart options={options} series={series} type="line" height={350} />
        </div>
      </Paper>
      <TableContainer component={Paper}>
        <Toolbar>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
            Transactions
          </Typography>
          <Tooltip title="Create transaction">
            <IconButton onClick={() => setOpenModal(true)}>
              <ShoppingCartOutlined />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Table sx={{ minWidth: 650 }} aria-label="Transactions table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions?.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreatePayment
        accountId={props.account.id}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
};
