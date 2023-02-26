import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Container,
  Grow,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useGetAllAccountsQuery } from "../redux/api/accountApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Add,
  DeleteOutline,
  Edit,
  LockOutlined,
  MoreVert,
  ShoppingCartOutlined,
  Token,
} from "@mui/icons-material";
import { CreateAccountDialog } from "../components/account/CreateAccountDialog";
import { useNavigate } from "react-router-dom";
import { stringAvatar } from "../components/stringAvatar";
import { CoinAmountView } from "../components/transaction/CoinAmountView";
import { UpdateAccountDialog } from "../components/account/UpdateAccountDialog";
import { AccountDto } from "../redux/api/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { DeleteAccountDialog } from "../components/account/DeleteAccountDialog";
import { RoleChip } from "../components/account/RoleChip";
import { CreatePaymentDialog } from "../components/transaction/CreatePaymentDialog";
import { AccountAuthenticationDialog } from "../components/account/AccountAuthenticationDialog";
import { AccountSessionDialog } from "../components/account/AccountSessionDialog";

export const AccountListPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

  useEffect(() => {
    if (isError) {
      toast.error("Could not load accounts!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 3 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Accounts
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/")}
              >
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                aria-current="page"
                onClick={() => navigate("/accounts")}
              >
                Accounts
              </Link>
            </Breadcrumbs>
          </div>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Add />}
            sx={{ whiteSpace: "nowrap", width: "13rem" }}
            onClick={() => setOpenModal(true)}
          >
            New account
          </Button>
        </Toolbar>
      </Box>
    </Paper>
  );

  if (isLoading || accounts === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  return (
    <Container maxWidth="lg">
      {header}
      <TableContainer component={Paper} elevation={4}>
        <Table aria-label="Account table">
          <TableHead>
            <TableRow>
              <TableCell width={72}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell width={250}>Balance</TableCell>
              <TableCell width={150}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((account) => (
              <AccountListRow key={account.id} account={account} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateAccountDialog open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

const AccountListRow = (props: { account: AccountDto }) => {
  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar
            alt={props.account.name}
            {...stringAvatar(props.account.name)}
          />
        </TableCell>
        <TableCell>
          <Typography>{props.account.name}</Typography>
          <RoleChip role={props.account.role} />
        </TableCell>
        <TableCell>{props.account.email}</TableCell>
        <TableCell>
          <CoinAmountView
            coins={props.account.balance}
            negativeIsError={true}
          />
        </TableCell>
        <TableCell>
          <AccountListRowActionButton account={props.account} />
        </TableCell>
      </TableRow>
    </>
  );
};

export const AccountListRowActionButton = (props: { account: AccountDto }) => {
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
        <Button onClick={() => navigate(`/accounts/${props.account.id}`)}>
          Profile
        </Button>
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
