import {
  Alert,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCompleteInventoryCheckMutation,
  useGetInventoryCheckQuery,
} from "../redux/api/inventoryApi";
import { useGetShoppingListQuery } from "../redux/api/shoppingListApi";
import { CompleteInventoryCheckDto } from "../../common/contracts";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { FormPage } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import { ProductAvatar } from "../components/product/ProductAvatar";
import { productDisplayName } from "../components/product/subProductUtils";
import { inventoryDateFormat } from "../components/inventory/inventoryFormat";

export const CompleteInventoryCheckPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const params = useParams();
  const checkId = parseInt(params.checkId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: check,
  } = useGetInventoryCheckQuery(checkId);
  const [completeCheck, { isLoading: isCompleting }] =
    useCompleteInventoryCheckMutation();
  // Open entries are needed to show which articles are already on the list;
  // the server skips those instead of creating a duplicate.
  const { data: openWishes } = useGetShoppingListQuery({ state: "open" });

  const [addToShoppingList, setAddToShoppingList] = React.useState(true);
  const note = t("inventory.complete.defaultName", {
    date: inventoryDateFormat.format(new Date()),
  });

  usePageTitle([
    t("layout.inventory"),
    t("inventory.check.title"),
    t("inventory.complete.title"),
  ]);

  useEffect(() => {
    if (isError) {
      toast.error(t("inventory.check.loadError"));
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const backTo = `/inventory/checks/${checkId}`;

  const navigation: PageHeaderNavigation[] = [
    {
      label: t("layout.inventory"),
      target: "/inventory",
    },
    {
      label: check
        ? t("inventory.check.titleWithDate", {
            date: inventoryDateFormat.format(new Date(check.started_at)),
          })
        : t("inventory.check.title"),
      target: backTo,
    },
    {
      label: t("inventory.complete.title"),
      target: `${backTo}/complete`,
    },
  ];

  if (isError) {
    return (
      <FormPage
        title={t("inventory.complete.title")}
        navigation={navigation}
        backTo="/inventory"
      >
        <Alert severity="error">{t("inventory.check.notFound")}</Alert>
      </FormPage>
    );
  }

  if (isLoading || !check) {
    return <FullScreenLoader />;
  }

  if (check.state === "completed") {
    return (
      <FormPage
        title={t("inventory.complete.title")}
        navigation={navigation}
        backTo={backTo}
        actions={
          <Button variant="outlined" onClick={() => navigate(backTo)}>
            {t("inventory.action.cancel")}
          </Button>
        }
      >
        <Alert severity="info">{t("inventory.check.readOnly")}</Alert>
      </FormPage>
    );
  }

  const belowTarget = check.items
    .filter(
      (i) =>
        i.counted_quantity !== null &&
        i.target_quantity - i.counted_quantity > 0
    )
    .map((i) => ({
      item: i,
      needed: i.target_quantity - (i.counted_quantity ?? 0),
      alreadyOnList: (openWishes ?? []).some(
        (wish) =>
          wish.product?.id === i.product.id &&
          (wish.sub_product_id ?? null) === (i.sub_product_id ?? null)
      ),
    }));
  const willBeAdded = belowTarget.filter((row) => !row.alreadyOnList).length;
  const uncountedCount = check.items.filter(
    (i) => i.counted_quantity === null
  ).length;

  const handleSubmit = async () => {
    const body: CompleteInventoryCheckDto = {
      add_to_shopping_list: addToShoppingList,
      note: note ?? undefined,
    };
    try {
      const result = await completeCheck({ id: checkId, body }).unwrap();
      const added = result.shopping_list_items.length;
      if (added > 0) {
        toast.success(t("inventory.complete.addedToList", { count: added }));
        navigate("/shopping-list");
      } else {
        toast.success(t("inventory.complete.success"));
        navigate("/inventory");
      }
    } catch (e) {
      toast.error(t("inventory.complete.error"));
      console.error(e);
    }
  };

  return (
    <FormPage
      title={t("inventory.complete.title")}
      subtitle={t("inventory.check.progress", {
        counted: check.items.length - uncountedCount,
        total: check.items.length,
      })}
      navigation={navigation}
      backTo={backTo}
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate(backTo)}>
            {t("inventory.action.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={isCompleting}
          >
            {t("inventory.complete.action")}
          </LoadingButton>
        </>
      }
    >
      {uncountedCount > 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t("inventory.complete.uncountedWarning", { count: uncountedCount })}
        </Alert>
      ) : null}

      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {t("inventory.complete.belowTarget")}
      </Typography>
      {belowTarget.length === 0 ? (
        <Typography color="text.secondary" sx={{ my: 1 }}>
          {t("inventory.complete.none")}
        </Typography>
      ) : (
        <List dense disablePadding sx={{ mb: 1 }}>
          {belowTarget.map(({ item, needed, alreadyOnList }) => (
            <ListItem
              key={`${item.product.id}-${item.sub_product_id ?? "p"}`}
              disableGutters
              secondaryAction={
                <Chip
                  size="small"
                  color={alreadyOnList ? "default" : "warning"}
                  variant={alreadyOnList ? "outlined" : "filled"}
                  label={
                    alreadyOnList
                      ? t("inventory.complete.alreadyOnList")
                      : t("inventory.complete.needed", { count: needed })
                  }
                />
              }
            >
              <ListItemAvatar>
                <ProductAvatar product={item.product} size={32} />
              </ListItemAvatar>
              <ListItemText
                primary={productDisplayName(item.product, item.sub_product_id)}
                secondary={`${item.counted_quantity} / ${item.target_quantity}`}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={
          <Switch
            checked={addToShoppingList && willBeAdded > 0}
            disabled={willBeAdded === 0}
            onChange={(e) => setAddToShoppingList(e.target.checked)}
          />
        }
        label={t("inventory.complete.addToShoppingList", {
          count: willBeAdded,
        })}
      />
      {willBeAdded > 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t("inventory.complete.addToShoppingListHint")}
        </Typography>
      ) : null}
    </FormPage>
  );
};
