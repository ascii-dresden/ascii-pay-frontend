import { Box, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { usePageTitle } from "../components/usePageTitle";
import { CoinBox } from "../components/register/CoinBox";
import { NoteBox } from "../components/register/NoteBox";
import { Envelope } from "../components/register/Envelope";
import { LocalAtm } from "@mui/icons-material";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { toggleResultMode } from "../redux/features/registerSlice";
import { useTranslation } from "react-i18next";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { ActionButtonAction } from "../components/ActionButton";

export const RegisterPage = () => {
  const { t } = useTranslation();

  const dispatch = useDashboardDispatch();

  usePageTitle(t("layout.register"));

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.register"),
      target: "/register",
    },
  ];

  const actions: ActionButtonAction[] = [
    {
      label: t("register.toggle"),
      icon: <LocalAtm />,
      action: () => dispatch(toggleResultMode()),
    },
  ];

  return (
    <Container maxWidth="lg">
      <PageHeader navigation={navigation} actions={actions}>
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
          {t("layout.register")}
        </Typography>
      </PageHeader>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: 18,
        }}
      >
        <Paper elevation={4} sx={{ overflow: "hidden" }}>
          <CoinBox />
          <NoteBox />
          <Envelope />
        </Paper>
      </Box>
    </Container>
  );
};
