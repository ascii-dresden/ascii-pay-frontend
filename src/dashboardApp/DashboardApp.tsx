import React, { useState } from "react";
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
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n_german from "./locales/de/translation.json";
import i18n_english from "./locales/en/translation.json";
import { blue, red } from "@mui/material/colors";
import { USE_DEV_COLOR_SCHEMA, USE_DEV_MODE } from "../const";
import styled from "@emotion/styled";

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
const PrintSnacksPage = React.lazy(() =>
  import("./pages/PrintSnacksPage").then((module) => ({
    default: module.PrintSnacksPage,
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
const RegisterPage = React.lazy(() =>
  import("./pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  }))
);
const RegisterHistoryListPage = React.lazy(() =>
  import("./pages/RegisterHistoryListPage").then((module) => ({
    default: module.RegisterHistoryListPage,
  }))
);
const AccountStatusListPage = React.lazy(() =>
  import("./pages/AccountStatusListPage").then((module) => ({
    default: module.AccountStatusListPage,
  }))
);
const AccountStatusDetailsPage = React.lazy(() =>
  import("./pages/AccountStatusDetailsPage").then((module) => ({
    default: module.AccountStatusDetailsPage,
  }))
);
const PurchaseListPage = React.lazy(() =>
  import("./pages/PurchaseListPage").then((module) => ({
    default: module.PurchaseListPage,
  }))
);
const PurchaseDetailsPage = React.lazy(() =>
  import("./pages/PurchaseDetailsPage").then((module) => ({
    default: module.PurchaseDetailsPage,
  }))
);

const StyledDashboardApp = styled.div`
  min-height: 100vh;
`;

export function DashboardApp() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [language, setLanguage] = useState(
    dashboardStore.getState().adminState.language
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: USE_DEV_MODE && USE_DEV_COLOR_SCHEMA ? red[600] : blue[700],
            light: USE_DEV_MODE && USE_DEV_COLOR_SCHEMA ? red[600] : blue[700],
            dark: USE_DEV_MODE && USE_DEV_COLOR_SCHEMA ? red[600] : blue[700],
          },
        },
        typography: {
          button: {
            textTransform: "none",
          },
        },
      }),
    [prefersDarkMode]
  );

  const resources = {
    de: {
      translation: i18n_german,
    },
    en: {
      translation: i18n_english,
    },
  };

  dashboardStore.subscribe(() => {
    setLanguage(dashboardStore.getState().adminState.language);
  });
  const i18nConfig = createInstance({
    resources,
    lng: language,
    fallbackLng: language === "dev" ? undefined : "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

  i18nConfig.use(initReactI18next).init().catch(console.error);

  return (
    <Provider store={dashboardStore}>
      <I18nextProvider i18n={i18nConfig}>
        <ThemeProvider theme={theme}>
          <StyledDashboardApp>
            <CssBaseline />
            <ToastContainer />
            <React.Suspense fallback={<FullScreenLoader />}>
              <Routes>
                <Route
                  path="/printSnacks"
                  element={<PrintSnacksPage />}
                ></Route>
                <Route element={<RequireUserLogin />}>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<ProfilePage />} />
                    <Route path="register" element={<RegisterPage />} />

                    <Route
                      element={
                        <RequireUserUnauthorized
                          allowedRoles={["Admin", "Purchaser"]}
                        />
                      }
                    >
                      <Route path="products" element={<ProductListPage />} />
                      <Route
                        path="products/:productId"
                        element={<ProductDetailsPage />}
                      />
                      <Route path="purchases" element={<PurchaseListPage />} />
                      <Route
                        path="purchases/:purchaseId"
                        element={<PurchaseDetailsPage />}
                      />
                    </Route>

                    <Route
                      element={
                        <RequireUserUnauthorized allowedRoles={["Admin"]} />
                      }
                    >
                      <Route path="accounts" element={<AccountListPage />} />
                      <Route
                        path="accounts/:accountId"
                        element={<AccountDetailsPage />}
                      />
                      <Route
                        path="accountStatus"
                        element={<AccountStatusListPage />}
                      />
                      <Route
                        path="accountStatus/:accountStatusId"
                        element={<AccountStatusDetailsPage />}
                      />
                      <Route
                        path="transactions"
                        element={<TransactionListPage />}
                      />
                      <Route path="terminal/:page" element={<TerminalPage />} />
                      <Route path="terminal" element={<TerminalPage />} />
                      <Route
                        path="registerHistory"
                        element={<RegisterHistoryListPage />}
                      />
                    </Route>
                  </Route>
                </Route>
                <Route path="setup" element={<SetupPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
              </Routes>
            </React.Suspense>
          </StyledDashboardApp>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
}
