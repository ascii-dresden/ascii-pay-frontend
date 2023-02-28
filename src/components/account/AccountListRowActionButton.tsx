import { AccountDto } from "../../redux/api/contracts";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
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
} from "@mui/material";
import {
  DeleteOutline,
  Edit,
  LockOutlined,
  MoreVert,
  ShoppingCartOutlined,
  Token,
} from "@mui/icons-material";
import { UpdateAccountDialog } from "./UpdateAccountDialog";
import { CreatePaymentDialog } from "../transaction/CreatePaymentDialog";
import { AccountAuthenticationDialog } from "./AccountAuthenticationDialog";
import { AccountSessionDialog } from "./AccountSessionDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export const AccountListRowActionButton = (props: {
  account: AccountDto;
  hidePrimaryAction?: boolean;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openSessionModal, setOpenSessionModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleMenuItemClick = (action: (value: boolean) => void) => {
    action(true);
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

  return (
    <>
      <ButtonGroup
        variant="outlined"
        size="large"
        ref={anchorRef}
        aria-label="split button"
      >
        {props.hidePrimaryAction ? null : (
          <Button onClick={() => navigate(`/accounts/${props.account.id}`)}>
            Profile
          </Button>
        )}
        <Button
          sx={{ whiteSpace: "nowrap", width: "3.5rem" }}
          onClick={handleToggle}
        >
          <MoreVert />
        </Button>
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
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenPaymentModal)}
                  >
                    <ListItemIcon>
                      <ShoppingCartOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Payment</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenEditModal)}
                  >
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit account details</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenAuthModal)}
                  >
                    <ListItemIcon>
                      <LockOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Authentication methods</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenSessionModal)}
                  >
                    <ListItemIcon>
                      <Token fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Active sessions</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenDeleteModal)}
                  >
                    <ListItemIcon>
                      <DeleteOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete account</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <UpdateAccountDialog
        account={props.account}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <CreatePaymentDialog
        account={props.account}
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
      />

      <AccountAuthenticationDialog
        account={props.account}
        open={openAuthModal}
        setOpen={setOpenAuthModal}
      />

      <AccountSessionDialog
        account={props.account}
        open={openSessionModal}
        setOpen={setOpenSessionModal}
      />

      <DeleteAccountDialog
        account={props.account}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};