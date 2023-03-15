import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProfilePage } from "./pages/ProfilePage";
import { RequireUserUnauthorized } from "./components/RequireUserUnauthorized";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AccountListPage } from "./pages/AccountListPage";
import { ProductListPage } from "./pages/ProductListPage";
import React from "react";
import { AccountDetailsPage } from "./pages/AccountDetailsPage";
import { SetupPage } from "./pages/SetupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { TerminalPage } from "./pages/TerminalPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { RequireUserLogin } from "./components/RequireUserLogin";
import { dashboardStore } from "./redux/dashboardStore";
import { Provider } from "react-redux";
import { GlobalStyle } from "./globalStyle";
import { Global } from "@emotion/react";
import { TransactionListPage } from "./pages/TransactionListPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export function DashboardApp() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
        typography: {
          button: {
            textTransform: "none",
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <Provider store={dashboardStore}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <Global styles={GlobalStyle} />
          <CssBaseline />
          <ToastContainer />
          <Routes>
            <Route element={<RequireUserLogin />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<ProfilePage />} />
                <Route
                  element={<RequireUserUnauthorized allowedRoles={["Admin"]} />}
                >
                  <Route path="accounts" element={<AccountListPage />} />
                  <Route
                    path="accounts/:accountId"
                    element={<AccountDetailsPage />}
                  />
                  <Route path="products" element={<ProductListPage />} />
                  <Route
                    path="products/:productId"
                    element={<ProductDetailsPage />}
                  />
                  <Route
                    path="transactions"
                    element={<TransactionListPage />}
                  />
                  <Route path="terminal/:page" element={<TerminalPage />} />
                  <Route path="terminal" element={<TerminalPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="setup" element={<SetupPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}
