import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import ProfilePage from "./pages/profilePage";
import LoginPage from "./pages/loginPage";
import UnauthorizedPage from "./pages/unauthorizedPage";
import RequireUser from "./components/requireUser";
import AdminPage from "./pages/adminPage";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountsPage from "./pages/accountsPage";
import ProductsPage from "./pages/productsPage";
import SetupPage from "./pages/setupPage";

export function App() {
  return (
    <>
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
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="create-admin-account" element={<SetupPage />} />
      </Routes>
    </>
  );
}
