import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { Link as RLink } from "react-router-dom";
import { usePageTitle } from "../components/usePageTitle";
import { CoinBox } from "../components/register/CoinBox";
import { NoteBox } from "../components/register/NoteBox";
import { Envelope } from "../components/register/Envelope";
import { LocalAtm } from "@mui/icons-material";
import {
  useDashboardDispatch,
  useDashboardSelector,
} from "../redux/dashboardStore";
import { toggleResultMode } from "../redux/features/registerSlice";
import { useTranslation } from "react-i18next";

export const RegisterPage = () => {
  const { t } = useTranslation();

  const isResultModel = useDashboardSelector(
    (state) => state.registerState.previous !== null
  );
  const dispatch = useDashboardDispatch();

  usePageTitle(t("layout.register"));

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              {t("layout.register")}
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" component={RLink} to="/">
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                aria-current="page"
                component={RLink}
                to="/register"
              >
                {t("layout.register")}
              </Link>
            </Breadcrumbs>
          </div>

          <Button
            variant={isResultModel ? "contained" : "outlined"}
            size="large"
            startIcon={<LocalAtm />}
            sx={{ whiteSpace: "nowrap", width: "13rem" }}
            onClick={() => dispatch(toggleResultMode())}
          >
            {t("register.toggle")}
          </Button>
        </Toolbar>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      {header}

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
