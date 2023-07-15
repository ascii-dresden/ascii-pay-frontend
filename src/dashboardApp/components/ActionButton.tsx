import React from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";

export type ActionButtonAction = {
  label: string;
  action?: () => void;
  href?: string;
  icon?: React.ReactNode;
};

export const ActionButton = (props: {
  actions?: ActionButtonAction[];
  minimize?: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const minimize = isMobile || props.minimize === true;

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  if (!props.actions || props.actions.length === 0) {
    return null;
  }

  let primaryButton;
  let secondaryButton;
  if (props.actions[0].href) {
    primaryButton = (
      <Button
        startIcon={props.actions[0].icon}
        sx={{ whiteSpace: "nowrap" }}
        component={Link}
        to={props.actions[0].href}
      >
        {props.actions[0].label}
      </Button>
    );

    secondaryButton = (
      <Button
        component="a"
        sx={{ whiteSpace: "nowrap", width: "3.5rem" }}
        onClick={handleToggle}
      >
        <MoreVert />
      </Button>
    );
  } else {
    primaryButton = (
      <Button
        startIcon={props.actions[0].icon}
        sx={{ whiteSpace: "nowrap" }}
        onClick={props.actions[0].action}
      >
        {props.actions[0].label}
      </Button>
    );

    secondaryButton = (
      <Button
        sx={{ whiteSpace: "nowrap", width: "3.5rem" }}
        onClick={handleToggle}
      >
        <MoreVert />
      </Button>
    );
  }

  if (!minimize && props.actions.length === 1) {
    return (
      <ButtonGroup
        variant="outlined"
        size="large"
        ref={anchorRef}
        aria-label="split button"
      >
        {primaryButton}
      </ButtonGroup>
    );
  }

  let menuItems = minimize ? props.actions : props.actions.slice(1);

  return (
    <>
      <ButtonGroup
        variant="outlined"
        size="large"
        ref={anchorRef}
        aria-label="split button"
      >
        {minimize ? null : primaryButton}
        {secondaryButton}
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {menuItems.map((item, index) => {
                    if (item.href) {
                      return (
                        <MenuItem component="a" href={item.href} key={index}>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText>{item.label}</ListItemText>
                        </MenuItem>
                      );
                    }
                    return (
                      <MenuItem
                        onClick={() => handleMenuItemClick(item.action!)}
                        key={index}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.label}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
