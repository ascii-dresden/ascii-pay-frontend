import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  useTheme,
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
  const theme = useTheme();
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
          <ListSubheader component="div">General</ListSubheader>
          <ListItem disablePadding>
            <NavLink
              to="/"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <Home />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListSubheader component="div">Administration</ListSubheader>
          <ListItem disablePadding>
            <NavLink
              to="/accounts"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Accounts" />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListItem disablePadding>
            <NavLink
              to="/products"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <Coffee />
                  </ListItemIcon>
                  <ListItemText primary="Products" />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListItem disablePadding>
            <NavLink
              to="/transactions"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <PublicOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Transactions" />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListSubheader component="div">Deployment</ListSubheader>
          <ListItem disablePadding>
            <NavLink
              to="/terminal"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <Store />
                  </ListItemIcon>
                  <ListItemText primary="Terminal" />
                </ListItemButton>
              )}
            </NavLink>
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
          <Link to="/">
            <Box sx={{ cursor: "pointer" }}>
              <img
                style={{
                  height: "2rem",
                  marginTop: "0.5rem",
                }}
                src={logo}
                alt="ascii pay"
              />
            </Box>
          </Link>
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
