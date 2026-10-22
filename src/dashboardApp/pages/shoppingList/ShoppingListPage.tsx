import React, { useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  List,
  Paper,
  Typography,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  PlaylistAddOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ShoppingListItemDto } from "../../../common/contracts";
import {
  shoppingListApi,
  useGetShoppingListQuery,
} from "../../redux/api/shoppingListApi";
import {
  useDashboardDispatch,
  useDashboardSelector,
} from "../../redux/dashboardStore";
import { PageHeader, PageHeaderNavigation } from "../../components/PageHeader";
import { ActionButtonAction } from "../../components/ActionButton";
import { usePageTitle } from "../../components/usePageTitle";
import { PaperScreenLoader } from "../../components/PaperScreenLoader";
import { PullToRefreshWrapper } from "../../components/PullToRefresh";
import {
  ShoppingListGroupHeading,
  ShoppingListItemRow,
} from "../../components/shoppingList/ShoppingListItemRow";
import {
  canEditShoppingListItem,
  canManageShoppingList,
  shoppingListSecondary,
  groupShoppingList,
  shoppingListLastUnitCents,
} from "../../components/shoppingList/shoppingListUtils";
import { usePurchaseHistory } from "../../components/purchase/usePurchaseHistory";
import {
  useMarkShoppingListItemDone,
  useRemoveShoppingListItem,
  useReopenShoppingListItem,
} from "../../components/shoppingList/useShoppingListActions";

const RECENT_LIMIT = 20;

export const shoppingListNavigation = (
  t: (key: string) => string
): PageHeaderNavigation[] => [
  { label: t("shoppingList.title"), target: "/shopping-list" },
];

/**
 * Shared shopping list (Einkaufsliste): open entries with delete (undo
 * toast) and, for purchasers/admins, a done checkbox; a collapsible section
 * lists recently bought entries with a reopen action.
 */
export const ShoppingListPage = () => {
  const { t } = useTranslation();
  const dispatch = useDashboardDispatch();
  const user = useDashboardSelector((state) => state.userState.user);
  const canManage = canManageShoppingList(user);

  const {
    isLoading,
    isError,
    error,
    data: openItems,
  } = useGetShoppingListQuery({ state: "open" });
  const [showRecent, setShowRecent] = React.useState(false);
  const { data: doneItems, isFetching: recentFetching } =
    useGetShoppingListQuery({ state: "done" }, { skip: !showRecent });

  const removeItem = useRemoveShoppingListItem();
  const markDone = useMarkShoppingListItemDone();
  const reopenItem = useReopenShoppingListItem();
  // Prices of the sub products listed below the entries.
  const { getLastPurchasesBySubProduct } = usePurchaseHistory();
  const [busyId, setBusyId] = React.useState<number | null>(null);

  usePageTitle(t("shoppingList.title"));

  useEffect(() => {
    if (isError) {
      toast.error(t("shoppingList.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleRefresh = () => {
    dispatch(shoppingListApi.util.invalidateTags(["ShoppingList"]));
  };

  const run = async (
    item: ShoppingListItemDto,
    action: (item: ShoppingListItemDto) => Promise<boolean>
  ) => {
    setBusyId(item.id);
    try {
      await action(item);
    } finally {
      setBusyId(null);
    }
  };

  const actions: ActionButtonAction[] = [
    {
      label: t("shoppingList.add"),
      icon: <PlaylistAddOutlined />,
      href: "/shopping-list/new",
    },
  ];

  const header = (
    <PageHeader navigation={shoppingListNavigation(t)} actions={actions}>
      <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
        {t("shoppingList.title")}
      </Typography>
    </PageHeader>
  );

  if (isLoading || openItems === undefined) {
    return <PaperScreenLoader>{header}</PaperScreenLoader>;
  }

  const recent = (doneItems ?? []).slice(0, RECENT_LIMIT);

  return (
    <PullToRefreshWrapper onRefresh={handleRefresh}>
      <Container maxWidth="md">
        {header}

        <Paper elevation={4}>
          {openItems.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                {t("shoppingList.empty")}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/shopping-list/new"
                startIcon={<PlaylistAddOutlined />}
                sx={{ mt: 2 }}
              >
                {t("shoppingList.add")}
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {groupShoppingList(openItems).map((row, index) => {
                const renderItem = (
                  item: ShoppingListItemDto,
                  nested: boolean
                ) => {
                  const editable = canEditShoppingListItem(user, item);
                  return (
                    <ShoppingListItemRow
                      key={item.id}
                      item={item}
                      nested={nested}
                      secondary={shoppingListSecondary(t, item, {
                        date: true,
                      })}
                      unitCents={
                        nested
                          ? shoppingListLastUnitCents(
                              item,
                              getLastPurchasesBySubProduct
                            )
                          : undefined
                      }
                      to={
                        editable ? `/shopping-list/${item.id}/edit` : undefined
                      }
                      onDone={canManage ? () => run(item, markDone) : undefined}
                      onDelete={
                        editable ? () => run(item, removeItem) : undefined
                      }
                      busy={busyId === item.id}
                    />
                  );
                };
                return (
                  <React.Fragment
                    key={
                      row.kind === "item"
                        ? row.item.id
                        : `group-${row.product.id}`
                    }
                  >
                    {index > 0 ? <Divider component="li" /> : null}
                    {row.kind === "item" ? (
                      renderItem(row.item, false)
                    ) : (
                      <>
                        <ShoppingListGroupHeading product={row.product} />
                        {row.items.map((item) => renderItem(item, true))}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Paper>

        <Paper elevation={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            color="inherit"
            onClick={() => setShowRecent((v) => !v)}
            endIcon={showRecent ? <ExpandLess /> : <ExpandMore />}
            sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}
          >
            <Typography variant="subtitle1" component="span">
              {t("shoppingList.recentlyBought")}
            </Typography>
          </Button>
          <Collapse in={showRecent} timeout="auto" unmountOnExit>
            <Divider />
            {recent.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  {recentFetching && doneItems === undefined
                    ? t("layout.loading")
                    : t("shoppingList.recentlyBoughtEmpty")}
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {recent.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 ? <Divider component="li" /> : null}
                    <ShoppingListItemRow
                      item={item}
                      done
                      secondary={shoppingListSecondary(t, item, {
                        doneDate: true,
                      })}
                      onReopen={
                        canManage ? () => run(item, reopenItem) : undefined
                      }
                      onDelete={
                        canEditShoppingListItem(user, item)
                          ? () => run(item, removeItem)
                          : undefined
                      }
                      busy={busyId === item.id}
                    />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Collapse>
        </Paper>
      </Container>
    </PullToRefreshWrapper>
  );
};
