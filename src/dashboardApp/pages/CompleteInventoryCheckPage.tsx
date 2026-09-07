import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  TextField,
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
import { useGetAllPurchasesQuery } from "../redux/api/purchaseApi";
import { CompleteInventoryCheckDto } from "../../common/contracts";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { FormPage } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import { ProductAvatar } from "../components/product/ProductAvatar";
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
  const { data: purchases } = useGetAllPurchasesQuery();

  const [generatePurchase, setGeneratePurchase] = React.useState(true);
  const [store, setStore] = React.useState("");
  const [name, setName] = React.useState(
    () =>
      t("inventory.complete.defaultName", {
        date: inventoryDateFormat.format(new Date()),
      }) ?? ""
  );

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

  const stores = Array.from(
    new Set((purchases ?? []).map((p) => p.store).filter((s) => s.length > 0))
  ).sort((a, b) => a.localeCompare(b));

  const belowTarget = check.items
    .filter(
      (i) =>
        i.counted_quantity !== null &&
        i.target_quantity - i.counted_quantity > 0
    )
    .map((i) => ({
      item: i,
      needed: i.target_quantity - (i.counted_quantity ?? 0),
    }));
  const uncountedCount = check.items.filter(
    (i) => i.counted_quantity === null
  ).length;

  const handleSubmit = async () => {
    const body: CompleteInventoryCheckDto = {
      generate_purchase: generatePurchase,
    };
    if (generatePurchase) {
      body.store = store;
      body.name = name;
    }
    try {
      const result = await completeCheck({ id: checkId, body }).unwrap();
      toast.success(t("inventory.complete.success"));
      if (result.purchase) {
        navigate(`/purchases/${result.purchase.id}/shop`);
      } else {
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
          {belowTarget.map(({ item, needed }) => (
            <ListItem
              key={item.product.id}
              disableGutters
              secondaryAction={
                <Chip
                  size="small"
                  color="warning"
                  label={t("inventory.complete.needed", { count: needed })}
                />
              }
            >
              <ListItemAvatar>
                <ProductAvatar product={item.product} size={32} />
              </ListItemAvatar>
              <ListItemText
                primary={item.product.name}
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
            checked={generatePurchase}
            onChange={(e) => setGeneratePurchase(e.target.checked)}
          />
        }
        label={t("inventory.complete.generatePurchase")}
      />

      {generatePurchase ? (
        <Box sx={{ mt: 2 }}>
          {belowTarget.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t("inventory.complete.noPurchaseHint")}
            </Alert>
          ) : null}
          <Autocomplete
            freeSolo
            options={stores}
            inputValue={store}
            onInputChange={(_, value) => setStore(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("purchase.store")}
                fullWidth
                sx={{ mb: "1rem" }}
              />
            )}
          />
          <TextField
            label={t("inventory.complete.name")}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
      ) : null}
    </FormPage>
  );
};
