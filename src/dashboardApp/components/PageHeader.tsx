import React from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Paper,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RLink } from "react-router-dom";
import { ActionButton, ActionButtonAction } from "./ActionButton";

export type PageHeaderNavigation = {
  label: string;
  target: string;
};

export const PageHeader = (props: {
  children?: React.ReactNode | React.ReactNode[];
  actions?: ActionButtonAction[];
  actionButtonView?: React.ReactNode;
  navigation?: PageHeaderNavigation[];
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let navigation;
  if (props.navigation) {
    navigation = (
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RLink} to="/">
          ascii-pay
        </Link>
        {props.navigation.map((nav, index) => {
          return (
            <Link
              key={index}
              underline="hover"
              color={
                index + 1 == props.navigation?.length
                  ? "text.primary"
                  : "inherit"
              }
              component={RLink}
              to={nav.target}
            >
              {nav.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  }

  let actionButton;
  if (props.actions && props.actions.length > 0) {
    actionButton = <ActionButton actions={props.actions} />;
  } else if (props.actionButtonView) {
    actionButton = props.actionButtonView;
  }

  let header;
  if (isMobile) {
    header = (
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        {navigation ? <Box sx={{ my: 1 }}>{navigation}</Box> : null}
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>{props.children}</div>
          {actionButton}
        </Toolbar>
      </Box>
    );
  } else {
    header = (
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        {" "}
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            {props.children}
            {navigation}
          </div>

          {actionButton}
        </Toolbar>
      </Box>
    );
  }

  return <Paper elevation={0}>{header}</Paper>;
};
