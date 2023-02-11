import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import ProfilePage from "./pages/profile.page";
import HomePage from "./pages/home.page";
import LoginPage from "./pages/login.page";
import UnauthorizePage from "./pages/unauthorize.page";
import RequireUser from "./components/requireUser";
import AdminPage from "./pages/admin.page";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";

export function App() {
  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* Private Route */}
          <Route element={<RequireUser allowedRoles={["user", "admin"]} />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route element={<RequireUser allowedRoles={["admin"]} />}>
            <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="unauthorized" element={<UnauthorizePage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </>
  );
}
