import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Fab,
  FormControlLabel,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link as RLink, useNavigate, useParams } from "react-router-dom";
import {
  Add,
  CheckCircleOutline,
  DeleteOutline,
  ErrorOutline,
  MoreVert,
  Refresh,
  Remove,
} from "@mui/icons-material";
import {
  inventoryApi,
  useGetInventoryCheckQuery,
  useUpdateInventoryCheckItemMutation,
} from "../redux/api/inventoryApi";
import { InventoryCheckItemDto } from "../../common/contracts";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import {
  useDashboardDispatch,
  useDashboardSelector,
} from "../redux/dashboardStore";
import { InventoryCheckStateChip } from "../components/inventory/InventoryCheckStateChip";
import { ProductAvatar } from "../components/product/ProductAvatar";
import {
  inventoryDateFormat,
  inventoryDateTimeFormat,
} from "../components/inventory/inventoryFormat";

export const InventoryCheckPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDashboardDispatch();
  const user = useDashboardSelector((state) => state.userState.user);

  const params = useParams();
  const checkId = parseInt(params.checkId ?? "");

  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: check,
  } = useGetInventoryCheckQuery(checkId);

  const [uncountedOnly, setUncountedOnly] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  usePageTitle([t("layout.inventory"), t("inventory.check.title")]);

  useEffect(() => {
    if (isError) {
      toast.error(t("inventory.check.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleRefresh = () => {
    dispatch(
      inventoryApi.util.invalidateTags([
        { type: "InventoryChecks", id: checkId },
      ])
    );
  };

  if (isLoading || !check) {
    return <FullScreenLoader />;
  }

  const readOnly = check.state === "completed";
  const total = check.items.length;
  const counted = check.items.filter((i) => i.counted_quantity !== null).length;
  const progress = total > 0 ? (counted / total) * 100 : 100;
  const canDelete = !readOnly || user?.role === "Admin";

  const visibleItems =
    uncountedOnly && !readOnly
      ? check.items.filter((i) => i.counted_quantity === null)
      : check.items;

  // Items arrive ordered by category, then name; keep that order.
  const groups: { category: string; items: InventoryCheckItemDto[] }[] = [];
  for (const item of visibleItems) {
    const last = groups[groups.length - 1];
    if (last && last.category === item.product.category) {
      last.items.push(item);
    } else {
      groups.push({ category: item.product.category, items: [item] });
    }
  }

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.inventory"),
      target: "/inventory",
    },
    {
      label: t("inventory.check.titleWithDate", {
        date: inventoryDateFormat.format(new Date(check.started_at)),
      }),
      target: `/inventory/checks/${checkId}`,
    },
  ];

  const actionButtonView = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title={t("inventory.action.refresh")}>
        <span>
          <IconButton onClick={handleRefresh} disabled={isFetching}>
            <Refresh />
          </IconButton>
        </span>
      </Tooltip>
      <IconButton
        aria-label="more"
        onClick={(e) => setMenuAnchor(e.currentTarget)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor !== null}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          disabled={!canDelete}
          onClick={() => {
            setMenuAnchor(null);
            navigate(`/inventory/checks/${checkId}/delete`);
          }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("inventory.action.deleteCheck")}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ pb: 12 }}>
      <PageHeader navigation={navigation} actionButtonView={actionButtonView}>
        <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
          <span style={{ marginRight: "0.6rem" }}>
            {t("inventory.check.title")}
          </span>
          <InventoryCheckStateChip state={check.state} />
        </Typography>
      </PageHeader>

      {readOnly ? (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            check.generated_purchase_id !== null ? (
              <Button
                color="inherit"
                size="small"
                component={RLink}
                to={`/purchases/${check.generated_purchase_id}`}
              >
                {t("inventory.action.openPurchase")}
              </Button>
            ) : undefined
          }
        >
          {t("inventory.check.completedNotice", {
            date: check.completed_at
              ? inventoryDateTimeFormat.format(new Date(check.completed_at))
              : "",
          })}{" "}
          {check.generated_purchase_id === null
            ? t("inventory.check.completedNoPurchase")
            : null}
        </Alert>
      ) : null}

      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: { xs: 56, sm: 64 },
          zIndex: 2,
          mb: 2,
          px: 2,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 1,
          }}
        >
          <Typography variant="subtitle1">
            {t("inventory.check.progress", { counted, total })}
          </Typography>
          {!readOnly ? (
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Switch
                  size="small"
                  checked={uncountedOnly}
                  onChange={(e) => setUncountedOnly(e.target.checked)}
                />
              }
              label={t("inventory.check.uncountedOnly")}
            />
          ) : null}
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={counted === total ? "success" : "primary"}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Paper>

      {groups.length === 0 ? (
        <Paper elevation={4} sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("inventory.check.allCounted")}
          </Typography>
        </Paper>
      ) : (
        groups.map((group) => (
          <Paper key={group.category} elevation={4} sx={{ mb: 2 }}>
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky>
                  {group.category.length > 0
                    ? group.category
                    : t("inventory.assortment.uncategorized")}
                </ListSubheader>
              }
            >
              {group.items.map((item) => (
                <CheckItemRow
                  key={item.product.id}
                  checkId={checkId}
                  item={item}
                  readOnly={readOnly}
                />
              ))}
            </List>
          </Paper>
        ))
      )}

      {!readOnly ? (
        <Fab
          variant="extended"
          color="primary"
          onClick={() => navigate(`/inventory/checks/${checkId}/complete`)}
          sx={{
            position: "fixed",
            bottom: { xs: 16, md: 32 },
            right: { xs: 16, md: 32 },
          }}
        >
          <CheckCircleOutline sx={{ mr: 1 }} />
          {t("inventory.action.complete")}
        </Fab>
      ) : null}
    </Container>
  );
};

const CheckItemRow = (props: {
  checkId: number;
  item: InventoryCheckItemDto;
  readOnly: boolean;
}) => {
  const { t } = useTranslation();
  const { item } = props;
  const [updateItem] = useUpdateInventoryCheckItemMutation();

  const [text, setText] = useState(
    item.counted_quantity === null ? "" : item.counted_quantity.toString()
  );
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(
        item.counted_quantity === null ? "" : item.counted_quantity.toString()
      );
    }
  }, [item.counted_quantity, focused]);

  const save = async (value: number | null) => {
    if (value === item.counted_quantity) {
      return;
    }
    setPending((p) => p + 1);
    setFailed(false);
    try {
      await updateItem({
        id: props.checkId,
        productId: item.product.id,
        body: { counted_quantity: value },
      }).unwrap();
    } catch (e) {
      setFailed(true);
      toast.error(t("inventory.check.itemSaveError"));
      console.error(e);
    } finally {
      setPending((p) => p - 1);
    }
  };

  const commitText = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      save(null);
      return;
    }
    const parsed = parseInt(trimmed, 10);
    if (isNaN(parsed) || parsed < 0) {
      setText(
        item.counted_quantity === null ? "" : item.counted_quantity.toString()
      );
      return;
    }
    save(parsed);
  };

  const step = (delta: number) => {
    const next = Math.max(0, (item.counted_quantity ?? 0) + delta);
    setText(next.toString());
    save(next);
  };

  const countedValue = item.counted_quantity;
  const diff =
    countedValue === null ? null : countedValue - item.target_quantity;

  let indicator: React.ReactNode = null;
  if (pending > 0) {
    indicator = <CircularProgress size={16} />;
  } else if (failed) {
    indicator = (
      <Tooltip title={t("inventory.check.itemSaveError")}>
        <ErrorOutline color="error" fontSize="small" />
      </Tooltip>
    );
  } else if (countedValue !== null) {
    indicator = (
      <Tooltip title={t("inventory.check.counted")}>
        <CheckCircleOutline
          color="success"
          fontSize="small"
          sx={{ opacity: 0.7 }}
        />
      </Tooltip>
    );
  }

  return (
    <ListItem divider sx={{ gap: 1, py: 1 }}>
      <ListItemAvatar>
        <ProductAvatar product={item.product} />
      </ListItemAvatar>
      <ListItemText
        primary={item.product.name}
        secondary={`${t("inventory.check.target")}: ${item.target_quantity}`}
        primaryTypographyProps={{ noWrap: true }}
        sx={{ minWidth: 0 }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {indicator}
        </Box>
        {props.readOnly ? (
          <Typography
            variant="h6"
            sx={{ minWidth: 48, textAlign: "right", pr: 1 }}
            color={countedValue === null ? "text.secondary" : "text.primary"}
          >
            {countedValue === null ? "–" : countedValue}
          </Typography>
        ) : (
          <>
            <IconButton
              aria-label={t("inventory.check.decrease") ?? "decrease"}
              onClick={() => step(-1)}
              disabled={countedValue === 0}
            >
              <Remove />
            </IconButton>
            <TextField
              type="number"
              size="small"
              value={text}
              placeholder="–"
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                commitText();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              inputProps={{
                min: 0,
                step: 1,
                inputMode: "numeric",
                "aria-label": t("inventory.check.counted") ?? "",
                style: {
                  textAlign: "center",
                  fontSize: "1.25rem",
                  padding: "6px 4px",
                  width: 56,
                  MozAppearance: "textfield",
                },
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
              }}
            />
            <IconButton
              aria-label={t("inventory.check.increase") ?? "increase"}
              onClick={() => step(1)}
            >
              <Add />
            </IconButton>
          </>
        )}
        {diff !== null ? (
          <Chip
            size="small"
            variant={diff < 0 ? "filled" : "outlined"}
            color={diff < 0 ? "warning" : "success"}
            label={diff > 0 ? `+${diff}` : diff}
            sx={{ minWidth: 44, display: { xs: "none", sm: "inline-flex" } }}
          />
        ) : null}
      </Box>
    </ListItem>
  );
};
