import { Box, Paper, Typography } from "@mui/material";
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
    <>
      <Paper sx={{ mr: 4, flex: "1 1 100%" }} elevation={4}>
        <Box sx={{ p: 2 }}>
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
        </Box>
      </Paper>
      <Paper sx={{ mr: 4, flex: "1 1 100%" }} elevation={4}>
        <Box sx={{ p: 2 }}>
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
        </Box>
      </Paper>
      <Paper sx={{ flex: "1 1 100%" }} elevation={4}>
        <Box sx={{ p: 2 }}>
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
        </Box>
      </Paper>
    </>
  );
};
