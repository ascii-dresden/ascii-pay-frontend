import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  useDashboardDispatch,
  useDashboardSelector,
} from "../redux/dashboardStore";
import { useLogoutUserMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";
import {
  AccountCircle,
  Coffee,
  Home,
  Menu,
  PublicOutlined,
  Store,
} from "@mui/icons-material";
import logo from "../../assets/ascii-pay-logo-wide.svg";
import { logout } from "../redux/features/userSlice";
import { PaperScreenLoader } from "./PaperScreenLoader";

const drawerWidth = 240;

const SearchButton = React.lazy(() =>
  import("./search/SearchButton").then((module) => ({
    default: module.SearchButton,
  }))
);

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useDashboardSelector((state) => state.userState.user);
  const dispatch = useDashboardDispatch();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [logoutUser, { isLoading, isSuccess, error, isError }] =
    useLogoutUserMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(logout());
      navigate("/");
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onLogoutHandler = async () => {
    logoutUser();
  };

  let activePage:
    | "home"
    | "accounts"
    | "products"
    | "transactions"
    | "terminal";
  if (location.pathname.startsWith("/accounts")) {
    activePage = "accounts";
  } else if (location.pathname.startsWith("/products")) {
    activePage = "products";
  } else if (location.pathname.startsWith("/transactions")) {
    activePage = "transactions";
  } else if (location.pathname.startsWith("/terminal")) {
    activePage = "terminal";
  } else {
    activePage = "home";
  }

  if (user?.role !== "Admin") {
    return (
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Box component={Link} to="/" sx={{ cursor: "pointer" }}>
                <img
                  style={{
                    height: "2rem",
                    marginTop: "0.5rem",
                  }}
                  src={logo}
                  alt="ascii pay"
                />
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box display="flex" sx={{ ml: "auto" }}>
                {user && (
                  <Button onClick={onLogoutHandler} color="inherit">
                    Logout
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: { xs: 0, md: 3 }, position: "relative" }}
        >
          <Toolbar />

          <React.Suspense
            fallback={<PaperScreenLoader hidePaper></PaperScreenLoader>}
          >
            <Outlet />
          </React.Suspense>
        </Box>
      </Box>
    );
  }

  const drawerContent = (
    <>
      <Toolbar></Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding onClick={() => navigate("/")}>
            <ListItemButton selected={activePage === "home"}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => navigate("/accounts")}>
            <ListItemButton selected={activePage === "accounts"}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => navigate("/products")}>
            <ListItemButton selected={activePage === "products"}>
              <ListItemIcon>
                <Coffee />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => navigate("/transactions")}>
            <ListItemButton selected={activePage === "transactions"}>
              <ListItemIcon>
                <PublicOutlined />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding onClick={() => navigate("/terminal")}>
            <ListItemButton selected={activePage === "terminal"}>
              <ListItemIcon>
                <Store />
              </ListItemIcon>
              <ListItemText primary="Terminal" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
            <img
              style={{
                height: "2rem",
                marginTop: "0.5rem",
              }}
              src={logo}
              alt="ascii pay"
            />
          </Box>
          <React.Suspense>
            <SearchButton />
          </React.Suspense>
          <Box sx={{ flexGrow: 1 }} />
          <Box display="flex" sx={{ ml: "auto" }}>
            {user && (
              <Button onClick={onLogoutHandler} color="inherit">
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 0, md: 3 }, position: "relative" }}
      >
        <Toolbar />

        <React.Suspense
          fallback={<PaperScreenLoader hidePaper></PaperScreenLoader>}
        >
          <Outlet />
        </React.Suspense>
      </Box>
    </Box>
  );
};
