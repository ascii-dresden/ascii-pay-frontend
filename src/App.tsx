import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { RequireUser } from "./components/RequireUser";
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
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { SetupPage } from "./pages/SetupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

export function App() {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            element={
              <RequireUser allowedRoles={["Basic", "Member", "Admin"]} />
            }
          >
            <Route index element={<ProfilePage />} />
          </Route>
          <Route element={<RequireUser allowedRoles={["Admin"]} />}>
            <Route path="accounts" element={<AccountListPage />} />
            <Route
              path="accounts/:accountId"
              element={<AccountDetailsPage />}
            />
            <Route path="products" element={<ProductListPage />} />
          </Route>
          <Route path="unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="setup" element={<SetupPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </ThemeProvider>
  );
}
