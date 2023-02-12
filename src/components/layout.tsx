import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../redux/store";
import { useLogoutUserMutation } from "../redux/api/authApi";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import {
  AccountCircle,
  AdminPanelSettings,
  Coffee,
  Home,
} from "@mui/icons-material";

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userState.user);

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

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            ascii pay
          </Typography>
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
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>Test</Toolbar>
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
          </List>

          {user && user?.role === "Admin" && (
            <>
              <Divider />
              <List>
                <ListItem disablePadding onClick={() => navigate("/admin")}>
                  <ListItemButton>
                    <ListItemIcon>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
