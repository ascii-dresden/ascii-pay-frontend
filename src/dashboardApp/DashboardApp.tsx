import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./components/Layout";
import { RequireUserUnauthorized } from "./components/RequireUserUnauthorized";
import { RequireUserLogin } from "./components/RequireUserLogin";
import { FullScreenLoader } from "./components/FullScreenLoader";
import { dashboardStore } from "./redux/dashboardStore";
import { Provider } from "react-redux";

const ProfilePage = React.lazy(() =>
  import("./pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  }))
);
const AccountListPage = React.lazy(() =>
  import("./pages/AccountListPage").then((module) => ({
    default: module.AccountListPage,
  }))
);
const ProductListPage = React.lazy(() =>
  import("./pages/ProductListPage").then((module) => ({
    default: module.ProductListPage,
  }))
);
const AccountDetailsPage = React.lazy(() =>
  import("./pages/AccountDetailsPage").then((module) => ({
    default: module.AccountDetailsPage,
  }))
);
const SetupPage = React.lazy(() =>
  import("./pages/SetupPage").then((module) => ({ default: module.SetupPage }))
);
const ResetPasswordPage = React.lazy(() =>
  import("./pages/ResetPasswordPage").then((module) => ({
    default: module.ResetPasswordPage,
  }))
);
const TerminalPage = React.lazy(() =>
  import("./pages/TerminalPage").then((module) => ({
    default: module.TerminalPage,
  }))
);
const ProductDetailsPage = React.lazy(() =>
  import("./pages/ProductDetailsPage").then((module) => ({
    default: module.ProductDetailsPage,
  }))
);
const TransactionListPage = React.lazy(() =>
  import("./pages/TransactionListPage").then((module) => ({
    default: module.TransactionListPage,
  }))
);

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <React.Suspense fallback={<FullScreenLoader />}>
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
        </React.Suspense>
      </ThemeProvider>
    </Provider>
  );
}
