import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useDeleteRegisterHistoryMutation,
  useGetAllRegisterHistoriesQuery,
} from "../redux/api/registerHistoryApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Remove,
} from "@mui/icons-material";
import { Link as RLink } from "react-router-dom";
import {
  RegisterHistoryDto,
  RegisterHistoryStateDto,
} from "../../common/contracts";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { dateToGrouping } from "../components/transaction/GlobalTransactionChart";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { usePageTitle } from "../components/usePageTitle";
import { moneyToString } from "../../terminalApp/components/Money";
import { getRegisterHistorySum } from "../../common/registerHistoryUtils";
import { LoadingButton } from "@mui/lab";

export const RegisterHistoryListPage = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const {
    isLoading,
    isError,
    error,
    data: registerHistories,
  } = useGetAllRegisterHistoriesQuery();

  usePageTitle("Register history");

  useEffect(() => {
    if (isError) {
      toast.error("Could not load register histories!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const rangePickerDisabled = isLoading || registerHistories === undefined;
  const rangePicker = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        opacity: rangePickerDisabled ? 0.5 : 1,
      }}
    >
      <DatePicker
        views={["year", "month", "day"]}
        label="Start date"
        value={startDate}
        onChange={(v) => setStartDate(v)}
        disabled={rangePickerDisabled}
      />
      <Remove sx={{ mx: 1, opacity: rangePickerDisabled ? 0.4 : 1 }} />
      <DatePicker
        views={["year", "month", "day"]}
        label="End date"
        value={endDate}
        onChange={(v) => setEndDate(v)}
        disabled={rangePickerDisabled}
      />
    </Box>
  );

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Register history
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" component={RLink} to="/">
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                aria-current="page"
                component={RLink}
                to="/registerHistory"
              >
                Register history
              </Link>
            </Breadcrumbs>
          </div>

          {rangePicker}
        </Toolbar>
      </Box>
    </Paper>
  );

  if (isLoading || registerHistories === undefined) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <PaperScreenLoader>{header}</PaperScreenLoader>
      </LocalizationProvider>
    );
  }

  let filteredRegisterHistories = registerHistories;
  if (startDate || endDate) {
    filteredRegisterHistories = registerHistories.filter((transaction) => {
      let date = new Date(transaction.timestamp);

      if (startDate && dateToGrouping(startDate) > dateToGrouping(date)) {
        return false;
      }

      if (endDate && dateToGrouping(endDate) < dateToGrouping(date)) {
        return false;
      }

      return true;
    });
  }

  let sortedRegisterHistories = [...filteredRegisterHistories];
  sortedRegisterHistories.reverse();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - sortedRegisterHistories.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedRegisterHistories =
    rowsPerPage > 0
      ? sortedRegisterHistories.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : sortedRegisterHistories;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Container maxWidth="lg">
        {header}

        <TableContainer component={Paper} elevation={4}>
          <Table aria-label="RegisterHistories table">
            <TableHead>
              <TableRow>
                <TableCell width={72}></TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Envelope</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell width={128}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedRegisterHistories?.map((registerHistory) => (
                <RegisterHistoryListRow
                  key={registerHistory.id}
                  registerHistory={registerHistory}
                />
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 67 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={sortedRegisterHistories.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </LocalizationProvider>
  );
};

const format = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "medium",
});

const RegisterHistoryListRow = (props: {
  registerHistory: RegisterHistoryDto;
}) => {
  const [open, setOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset !important" } }}
        style={{ height: 67 }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {format.format(new Date(props.registerHistory.timestamp))}
        </TableCell>
        <TableCell>
          {moneyToString(
            getRegisterHistorySum(props.registerHistory.source_register)
          )}
        </TableCell>
        <TableCell>
          {moneyToString(
            getRegisterHistorySum(props.registerHistory.envelope_register)
          )}
        </TableCell>
        <TableCell>
          {moneyToString(
            getRegisterHistorySum(props.registerHistory.target_register)
          )}
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" size="large">
            <Button onClick={() => setOpenDeleteModal(true)}>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table
                size="small"
                aria-label="purchases"
                sx={{ whiteSpace: "nowrap" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">
                      {moneyToString(10000, "")}
                    </TableCell>
                    <TableCell align="right">
                      {moneyToString(5000, "")}
                    </TableCell>
                    <TableCell align="right">
                      {moneyToString(2000, "")}
                    </TableCell>
                    <TableCell align="right">
                      {moneyToString(1000, "")}
                    </TableCell>
                    <TableCell align="right">
                      {moneyToString(500, "")}
                    </TableCell>
                    <TableCell align="right">
                      {moneyToString(200, "")}
                    </TableCell>
                    <TableCell align="right">
                      {moneyToString(100, "")}
                    </TableCell>
                    <TableCell align="right">{moneyToString(50, "")}</TableCell>
                    <TableCell align="right">{moneyToString(20, "")}</TableCell>
                    <TableCell align="right">{moneyToString(10, "")}</TableCell>
                    <TableCell align="right">{moneyToString(5, "")}</TableCell>
                    <TableCell align="right">{moneyToString(2, "")}</TableCell>
                    <TableCell align="right">{moneyToString(1, "")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    key="source"
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell>Total</TableCell>
                    <RegisterStateRow
                      row={props.registerHistory.source_register}
                    />
                  </TableRow>
                  <TableRow
                    key="envelope"
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell>Envelope</TableCell>
                    <RegisterStateRow
                      row={props.registerHistory.envelope_register}
                    />
                  </TableRow>
                  <TableRow
                    key="target"
                    sx={{ "& > *": { borderBottom: "unset !important" } }}
                  >
                    <TableCell>Remaining</TableCell>
                    <RegisterStateRow
                      row={props.registerHistory.target_register}
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <DeleteRegisterHistoryDialog
        registerHistory={props.registerHistory}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};

const RegisterStateRow = (props: { row: RegisterHistoryStateDto }) => {
  return (
    <>
      <TableCell align="right">{props.row.note100}</TableCell>
      <TableCell align="right">{props.row.note50}</TableCell>
      <TableCell align="right">{props.row.note20}</TableCell>
      <TableCell align="right">{props.row.note10}</TableCell>
      <TableCell align="right">{props.row.note5}</TableCell>
      <TableCell align="right">{props.row.coin200}</TableCell>
      <TableCell align="right">{props.row.coin100}</TableCell>
      <TableCell align="right">{props.row.coin50}</TableCell>
      <TableCell align="right">{props.row.coin20}</TableCell>
      <TableCell align="right">{props.row.coin10}</TableCell>
      <TableCell align="right">{props.row.coin5}</TableCell>
      <TableCell align="right">{props.row.coin2}</TableCell>
      <TableCell align="right">{props.row.coin1}</TableCell>
    </>
  );
};

const DeleteRegisterHistoryDialog = (props: {
  registerHistory: RegisterHistoryDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteRegisterHistory, { isLoading, isError, error, isSuccess }] =
    useDeleteRegisterHistoryMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Register history deleted successfully!");
      props.setOpen(false);
    } else if (isError) {
      toast.error("Register history could not be deleted!");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit = () => {
    deleteRegisterHistory(props.registerHistory.id);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">Delete register history?</Typography>
        <IconButton
          aria-label="close"
          onClick={() => props.setOpen(false)}
          sx={{
            position: "absolute",
            right: 16,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box pt={1}>
          Do you want to permanently delete the register history{" "}
          <b>{format.format(new Date(props.registerHistory.timestamp))}</b> (
          {moneyToString(
            getRegisterHistorySum(props.registerHistory.source_register)
          )}
          )? This action cannot be undone!
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={isLoading}
          color="error"
        >
          Delete Register History
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
