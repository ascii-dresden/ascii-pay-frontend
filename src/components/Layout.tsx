import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
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
import { useAppSelector } from "../redux/store";
import { useLogoutUserMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import {
  AccountCircle,
  Coffee,
  Home,
  Menu,
  Terminal,
} from "@mui/icons-material";
import logo from "../assets/ascii-pay-logo-wide.svg";

const drawerWidth = 240;

export const Layout = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [logoutUser, { isLoading, isSuccess, error, isError }] =
    useLogoutUserMutation();

  useEffect(() => {
    if (isSuccess) {
      window.location.href = "/login";
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

  const drawerContent = (
    <>
      <Toolbar></Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding onClick={() => navigate("/")}>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => navigate("/accounts")}>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Accounts" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => navigate("/products")}>
            <ListItemButton>
              <ListItemIcon>
                <Coffee />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding onClick={() => navigate("/terminal")}>
            <ListItemButton>
              <ListItemIcon>
                <Terminal />
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
          <Box display="flex" sx={{ ml: "auto" }}>
            {!user && (
              <>
                <LoadingButton
                  onClick={() => navigate("/login")}
                  color="inherit"
                >
                  Login
                </LoadingButton>
              </>
            )}
            {user && (
              <LoadingButton
                onClick={onLogoutHandler}
                loading={isLoading}
                color="inherit"
              >
                Logout
              </LoadingButton>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
