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
  Menu,
  MenuItem,
  Toolbar,
  Typography,
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
  LanguageOutlined,
  LocalAtm,
  MenuOutlined,
  PriceChangeOutlined,
  PublicOutlined,
  Store,
  TranslateOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import logo from "../../assets/ascii-pay-logo-wide.svg";
import { logout } from "../redux/features/userSlice";
import { PaperScreenLoader } from "./PaperScreenLoader";
import { useTranslation } from "react-i18next";
import {
  setLanguage,
  toggleRevealAllHiddenFields,
} from "../redux/features/adminSlice";
import { BASE_URL } from "../../const";

const drawerWidth = 240;

const SearchButton = React.lazy(() =>
  import("./search/SearchButton").then((module) => ({
    default: module.SearchButton,
  }))
);

export const Layout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const user = useDashboardSelector((state) => state.userState.user);
  const revealAllHiddenFields = useDashboardSelector(
    (state) => state.adminState.revealAllHiddenFields
  );
  const language = useDashboardSelector((state) => state.adminState.language);
  const dispatch = useDashboardDispatch();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [logoutUser, { isLoading, isSuccess, error, isError }] =
    useLogoutUserMutation();

  const [anchorTranslateEl, setAnchorTranslateEl] =
    React.useState<null | HTMLElement>(null);

  const handleTranslateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorTranslateEl(event.currentTarget);
  };
  const handleTranslateClose = (language?: string) => {
    if (language) {
      dispatch(setLanguage(language));
    }

    setAnchorTranslateEl(null);
  };

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

  const toggleRevealAllHiddenFieldsHandler = () => {
    dispatch(toggleRevealAllHiddenFields());
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
                  alt="ascii-pay"
                />
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box display="flex" sx={{ ml: "auto" }}>
                {user && (
                  <Button onClick={onLogoutHandler} color="inherit">
                    {t("layout.logout")}
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
          <ListSubheader component="div">{t("layout.general")}</ListSubheader>
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
                  <ListItemText primary={t("layout.profile")} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListItem disablePadding>
            <NavLink
              to="/register"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <LocalAtm />
                  </ListItemIcon>
                  <ListItemText primary={t("layout.register")} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListSubheader component="div">
            {t("layout.administration")}
          </ListSubheader>
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
                  <ListItemText primary={t("layout.accounts")} />
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
                  <ListItemText primary={t("layout.products")} />
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
                  <ListItemText primary={t("layout.transactions")} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListItem disablePadding>
            <NavLink
              to="/registerHistory"
              style={{
                width: "100%",
                textDecoration: "none",
                color: theme.palette.text.primary,
              }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <PriceChangeOutlined />
                  </ListItemIcon>
                  <ListItemText primary={t("layout.registerHistory")} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
          <ListSubheader component="div">
            {t("layout.deployment")}
          </ListSubheader>
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
                  <ListItemText primary={t("layout.terminal")} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        </List>
      </Box>
    </>
  );

  let devMode;
  if (import.meta.env.DEV) {
    devMode = (
      <Box display="flex" sx={{ ml: "auto", pr: 2 }}>
        <Box component="code" sx={{ fontSize: 9 }}>
          development mode
          <br />
          {BASE_URL}
        </Box>
      </Box>
    );
  }

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
            <MenuOutlined />
          </IconButton>
          <Link to="/">
            <Box sx={{ cursor: "pointer" }}>
              <img
                style={{
                  height: "2rem",
                  marginTop: "0.5rem",
                }}
                src={logo}
                alt="ascii-pay"
              />
            </Box>
          </Link>
          <React.Suspense>
            <SearchButton />
          </React.Suspense>
          <Box display="flex" sx={{ ml: "auto" }}>
            <IconButton
              onClick={handleTranslateClick}
              title={t("layout.toggleLanguage") ?? undefined}
              color="inherit"
            >
              <TranslateOutlined />
            </IconButton>
            <Menu
              anchorEl={anchorTranslateEl}
              open={anchorTranslateEl !== null}
              onClose={() => handleTranslateClose()}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={() => handleTranslateClose("de")}
                selected={language.includes("de")}
              >
                <ListItemIcon>
                  <LanguageOutlined />
                </ListItemIcon>
                <Typography variant="inherit">Deutsch</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleTranslateClose("en")}
                selected={language.includes("en")}
              >
                <ListItemIcon>
                  <LanguageOutlined />
                </ListItemIcon>
                <Typography variant="inherit">English</Typography>
              </MenuItem>
            </Menu>
            <IconButton
              onClick={toggleRevealAllHiddenFieldsHandler}
              title={t("layout.hiddenFieldToggle") ?? undefined}
              color="inherit"
            >
              {revealAllHiddenFields ? (
                <VisibilityOffOutlined />
              ) : (
                <VisibilityOutlined />
              )}
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {devMode}
          <Box display="flex" sx={{ ml: "auto" }}>
            {user && (
              <Button onClick={onLogoutHandler} color="inherit">
                {t("layout.logout")}
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
