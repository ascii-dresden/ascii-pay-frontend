import { Grid, Paper, Typography } from "@mui/material";
import { CoinAmountView } from "./CoinAmountView";
import React from "react";
import { TransactionDto } from "../../../common/contracts";
import { useTranslation } from "react-i18next";

export const GlobalTransactionSummary = (props: {
  transactions: TransactionDto[];
  previousTransactions: TransactionDto[];
}) => {
  const { t } = useTranslation();

  let totalUpCent = 0;
  let totalUpBottleStamp = 0;
  let totalUpCoffeeStamp = 0;
  let totalDownCent = 0;
  let totalDownBottleStamp = 0;
  let totalDownCoffeeStamp = 0;

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

  for (let transaction of props.transactions) {
    for (let item of transaction.items) {
      if (item.effective_price.Cent && item.effective_price.Cent > 0) {
        totalDownCent -= item.effective_price.Cent;
      }
      if (
        item.effective_price.BottleStamp &&
        item.effective_price.BottleStamp > 0
      ) {
        totalDownBottleStamp -= item.effective_price.BottleStamp;
      }
      if (
        item.effective_price.CoffeeStamp &&
        item.effective_price.CoffeeStamp > 0
      ) {
        totalDownCoffeeStamp -= item.effective_price.CoffeeStamp;
      }

      if (item.effective_price.Cent && item.effective_price.Cent < 0) {
        totalUpCent -= item.effective_price.Cent;
      }
      if (
        item.effective_price.BottleStamp &&
        item.effective_price.BottleStamp < 0
      ) {
        totalUpBottleStamp -= item.effective_price.BottleStamp;
      }
      if (
        item.effective_price.CoffeeStamp &&
        item.effective_price.CoffeeStamp < 0
      ) {
        totalUpCoffeeStamp -= item.effective_price.CoffeeStamp;
      }
    }
  }

  return (
    <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
          <Typography gutterBottom variant="h6" component="div">
            {t("transactions.totalDeposit")}
          </Typography>
          <CoinAmountView
            large
            coins={{
              Cent: totalUpCent,
              BottleStamp: totalUpBottleStamp,
              CoffeeStamp: totalUpCoffeeStamp,
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
          <Typography gutterBottom variant="h6" component="div">
            {t("transactions.totalPayout")}
          </Typography>
          <CoinAmountView
            large
            coins={{
              Cent: totalDownCent,
              BottleStamp: totalDownBottleStamp,
              CoffeeStamp: totalDownCoffeeStamp,
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: "100%", p: 2 }} elevation={4}>
          <Typography gutterBottom variant="h6" component="div">
            {t("transactions.systemBalance")}
          </Typography>
          <CoinAmountView
            large
            coins={{
              Cent:
                previousUpCent + totalUpCent + previousDownCent + totalDownCent,
              BottleStamp: totalUpBottleStamp + totalDownBottleStamp,
              CoffeeStamp: totalUpCoffeeStamp + totalDownCoffeeStamp,
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
