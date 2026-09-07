import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link as RLink, useNavigate } from "react-router-dom";
import {
  ExpandMore,
  HistoryOutlined,
  PlaylistAddCheck,
  ShoppingCartOutlined,
  Tune,
  WarningAmber,
} from "@mui/icons-material";
import {
  inventoryApi,
  useCreateInventoryCheckMutation,
  useGetInventoryChecksQuery,
  useGetInventoryQuery,
  useUpdateInventoryProductsMutation,
} from "../redux/api/inventoryApi";
import {
  InventoryCheckSummaryDto,
  InventoryRowDto,
} from "../../common/contracts";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { ActionButtonAction } from "../components/ActionButton";
import { usePageTitle } from "../components/usePageTitle";
import { PaperScreenLoader } from "../components/PaperScreenLoader";
import { PullToRefreshWrapper } from "../components/PullToRefresh";
import { DefaultTablePagination } from "../components/DefaultTablePagination";
import { useDashboardDispatch } from "../redux/dashboardStore";
import { moneyToString } from "../../terminalApp/components/Money";
import { InventoryCheckStateChip } from "../components/inventory/InventoryCheckStateChip";
import { ProductAvatar } from "../components/product/ProductAvatar";
import {
  inventoryDateFormat,
  inventoryDateTimeFormat,
} from "../components/inventory/inventoryFormat";

const isBelowTarget = (row: InventoryRowDto) =>
  row.estimated_quantity !== null &&
  row.estimated_quantity < row.target_quantity;

export const InventoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDashboardDispatch();

  const { isLoading, isError, error, data: rows } = useGetInventoryQuery();
  const { data: draftChecks } = useGetInventoryChecksQuery({ state: "draft" });
  const { data: checks } = useGetInventoryChecksQuery();
  const [createCheck, { isLoading: isCreating }] =
    useCreateInventoryCheckMutation();

  const [belowTargetOnly, setBelowTargetOnly] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  usePageTitle(t("layout.inventory"));

  useEffect(() => {
    if (isError) {
      toast.error(t("inventory.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleRefresh = () => {
    dispatch(
      inventoryApi.util.invalidateTags(["Inventory", "InventoryChecks"])
    );
  };

  const draftCheck =
    draftChecks && draftChecks.length > 0 ? draftChecks[0] : undefined;

  const handleStartCheck = async () => {
    if (draftCheck) {
      navigate(`/inventory/checks/${draftCheck.id}`);
      return;
    }
    try {
      const check = await createCheck({}).unwrap();
      navigate(`/inventory/checks/${check.id}`);
    } catch (e) {
      toast.error(t("inventory.check.createError"));
      console.error(e);
    }
  };

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.inventory"),
      target: "/inventory",
    },
  ];

  const actions: ActionButtonAction[] = [
    {
      label: t("inventory.action.manageAssortment"),
      icon: <Tune />,
      href: "/inventory/assortment",
    },
    {
      label: draftCheck
        ? t("inventory.action.continueCheck")
        : t("inventory.action.startCheck"),
      icon: <PlaylistAddCheck />,
      action: handleStartCheck,
    },
  ];

  const header = (
    <PageHeader navigation={navigation} actions={actions}>
      <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
        {t("layout.inventory")}
      </Typography>
    </PageHeader>
  );

  if (isLoading || rows === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  const belowTargetCount = rows.filter(isBelowTarget).length;
  const filteredRows = belowTargetOnly ? rows.filter(isBelowTarget) : rows;
  const slicedRows =
    rowsPerPage > 0
      ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : filteredRows;

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="lg">
        {header}

        {draftCheck ? (
          <Alert
            severity="info"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                component={RLink}
                to={`/inventory/checks/${draftCheck.id}`}
              >
                {t("inventory.action.continueCheck")}
              </Button>
            }
          >
            {t("inventory.draftNotice", {
              date: inventoryDateFormat.format(new Date(draftCheck.started_at)),
              counted: draftCheck.counted_count,
              total: draftCheck.item_count,
            })}
          </Alert>
        ) : null}

        <Paper elevation={4}>
          <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={belowTargetOnly}
                  onChange={(e) => {
                    setBelowTargetOnly(e.target.checked);
                    setPage(0);
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {t("inventory.filter.belowTarget")}
                  <Chip
                    size="small"
                    color={belowTargetCount > 0 ? "warning" : "default"}
                    label={belowTargetCount}
                  />
                </Box>
              }
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                startIcon={<PlaylistAddCheck />}
                disabled={draftCheck !== undefined || isCreating}
                onClick={handleStartCheck}
              >
                {t("inventory.action.startCheck")}
              </Button>
              {draftCheck ? (
                <FormHelperText sx={{ textAlign: "right" }}>
                  <Link
                    component={RLink}
                    to={`/inventory/checks/${draftCheck.id}`}
                  >
                    {t("inventory.action.continueCheck")}
                  </Link>
                </FormHelperText>
              ) : null}
            </Box>
          </Toolbar>
          <Divider />
          <TableContainer>
            <Table aria-label="Inventory table">
              <TableHead>
                <TableRow>
                  <TableCell width={72} />
                  <TableCell>{t("inventory.column.product")}</TableCell>
                  <TableCell width={120} align="right">
                    {t("inventory.column.target")}
                  </TableCell>
                  <TableCell width={150} align="right">
                    {t("inventory.column.lastCounted")}
                  </TableCell>
                  <TableCell width={170} align="right">
                    {t("inventory.column.estimated")}
                  </TableCell>
                  <TableCell width={190} align="right">
                    {t("inventory.column.lastPurchase")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedRows.map((row) => (
                  <InventoryTableRow key={row.product.id} row={row} />
                ))}
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        {rows.length === 0
                          ? t("inventory.empty")
                          : t("inventory.noMatches")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          <DefaultTablePagination
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>

        <Paper elevation={4} sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
          <ListItemButton onClick={() => setHistoryOpen((open) => !open)}>
            <ListItemIcon>
              <HistoryOutlined />
            </ListItemIcon>
            <ListItemText
              primary={t("inventory.history.title")}
              secondary={checks ? checks.length : undefined}
            />
            <ExpandMore
              sx={{
                transform: historyOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </ListItemButton>
          <Collapse in={historyOpen}>
            <Divider />
            {!checks || checks.length === 0 ? (
              <Typography sx={{ p: 2 }} color="text.secondary">
                {t("inventory.history.empty")}
              </Typography>
            ) : (
              <List dense disablePadding>
                {checks.map((check) => (
                  <CheckHistoryRow key={check.id} check={check} />
                ))}
              </List>
            )}
          </Collapse>
        </Paper>
      </Container>
    </PullToRefreshWrapper>
  );
};

const InventoryTableRow = (props: { row: InventoryRowDto }) => {
  const { t } = useTranslation();
  const { row } = props;
  const below = isBelowTarget(row);
  const lastPurchase = row.last_purchase;
  const unitPrice = lastPurchase
    ? Math.round(
        lastPurchase.container_cents / Math.max(1, lastPurchase.container_size)
      )
    : null;

  return (
    <TableRow hover style={{ height: 78 }}>
      <TableCell>
        <ProductAvatar product={row.product} />
      </TableCell>
      <TableCell>
        <Link
          component={RLink}
          to={`/products/${row.product.id}`}
          color="inherit"
          underline="hover"
        >
          <Typography component="span">{row.product.name}</Typography>
        </Link>
        <Typography variant="caption" display="block" color="text.secondary">
          {row.product.category.length > 0
            ? row.product.category
            : t("inventory.assortment.uncategorized")}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <TargetQuantityField
          productId={row.product.id}
          target={row.target_quantity}
        />
      </TableCell>
      <TableCell align="right">
        {row.last_counted_quantity !== null && row.last_counted_at ? (
          <>
            <Typography>{row.last_counted_quantity}</Typography>
            <Typography variant="caption" color="text.secondary">
              {inventoryDateFormat.format(new Date(row.last_counted_at))}
            </Typography>
          </>
        ) : (
          <Tooltip title={t("inventory.neverCounted")}>
            <Typography color="text.secondary" component="span">
              –
            </Typography>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="right">
        {row.estimated_quantity === null ? (
          <Tooltip title={t("inventory.neverCounted")}>
            <Typography color="text.secondary" component="span">
              –
            </Typography>
          </Tooltip>
        ) : (
          <>
            <Tooltip
              title={
                below
                  ? t("inventory.belowTargetHint", {
                      missing: row.target_quantity - row.estimated_quantity,
                    })
                  : t("inventory.estimateHint")
              }
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: below ? "warning.main" : "inherit",
                }}
              >
                {below ? <WarningAmber fontSize="small" /> : null}
                <Typography fontWeight={below ? "bold" : undefined}>
                  ≈ {row.estimated_quantity}
                </Typography>
              </Box>
            </Tooltip>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {t("inventory.estimate")}
            </Typography>
          </>
        )}
      </TableCell>
      <TableCell align="right">
        {lastPurchase && unitPrice !== null ? (
          <>
            <Typography>
              {moneyToString(unitPrice)}{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                {t("inventory.column.unitPrice")}
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lastPurchase.container_size} ×{" "}
              {moneyToString(lastPurchase.container_cents)} ·{" "}
              {inventoryDateFormat.format(new Date(lastPurchase.timestamp))}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary" component="span">
            –
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

const TargetQuantityField = (props: { productId: number; target: number }) => {
  const { t } = useTranslation();
  const [text, setText] = useState(props.target.toString());
  const [updateInventoryProducts, { isLoading }] =
    useUpdateInventoryProductsMutation();

  useEffect(() => {
    setText(props.target.toString());
  }, [props.target]);

  const commit = async () => {
    const parsed = parseInt(text, 10);
    if (isNaN(parsed) || parsed < 0 || parsed === props.target) {
      setText(props.target.toString());
      return;
    }
    try {
      await updateInventoryProducts([
        { product_id: props.productId, stocked: true, target_quantity: parsed },
      ]).unwrap();
    } catch (e) {
      toast.error(t("inventory.saveError"));
      console.error(e);
      setText(props.target.toString());
    }
  };

  return (
    <TextField
      type="number"
      size="small"
      value={text}
      disabled={isLoading}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
      inputProps={{
        min: 0,
        step: 1,
        inputMode: "numeric",
        "aria-label": t("inventory.column.target") ?? "",
        style: { textAlign: "right", width: 56 },
      }}
    />
  );
};

const CheckHistoryRow = (props: { check: InventoryCheckSummaryDto }) => {
  const { t } = useTranslation();
  const { check } = props;

  return (
    <ListItem
      disablePadding
      divider
      secondaryAction={
        check.generated_purchase_id !== null ? (
          <Tooltip title={t("inventory.action.openPurchase")}>
            <IconButton
              edge="end"
              component={RLink}
              to={`/purchases/${check.generated_purchase_id}`}
            >
              <ShoppingCartOutlined />
            </IconButton>
          </Tooltip>
        ) : undefined
      }
    >
      <ListItemButton component={RLink} to={`/inventory/checks/${check.id}`}>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>
                {inventoryDateTimeFormat.format(new Date(check.started_at))}
              </span>
              <InventoryCheckStateChip state={check.state} />
            </Box>
          }
          secondary={
            <>
              {t("inventory.history.counted", {
                counted: check.counted_count,
                total: check.item_count,
              })}
              {check.generated_purchase_id !== null
                ? ` · ${t("inventory.history.purchase", {
                    id: check.generated_purchase_id,
                  })}`
                : ""}
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
