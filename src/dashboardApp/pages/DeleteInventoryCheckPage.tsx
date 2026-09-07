import { Alert, Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteInventoryCheckMutation,
  useGetInventoryCheckQuery,
} from "../redux/api/inventoryApi";
import { useDashboardSelector } from "../redux/dashboardStore";
import { usePageTitle } from "../components/usePageTitle";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { FormPage } from "../components/FormPage";
import { PageHeaderNavigation } from "../components/PageHeader";
import { InventoryCheckStateChip } from "../components/inventory/InventoryCheckStateChip";
import {
  inventoryDateFormat,
  inventoryDateTimeFormat,
} from "../components/inventory/inventoryFormat";

export const DeleteInventoryCheckPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useDashboardSelector((state) => state.userState.user);

  const params = useParams();
  const checkId = parseInt(params.checkId ?? "");

  const {
    isLoading,
    isError,
    error,
    data: check,
  } = useGetInventoryCheckQuery(checkId);
  const [deleteCheck, { isLoading: isDeleting }] =
    useDeleteInventoryCheckMutation();

  usePageTitle([
    t("layout.inventory"),
    t("inventory.check.title"),
    t("inventory.action.deleteCheck"),
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
      label: t("inventory.action.deleteCheck"),
      target: `${backTo}/delete`,
    },
  ];

  if (isError) {
    return (
      <FormPage
        title={t("inventory.check.deleteTitle")}
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

  const canDelete = check.state !== "completed" || user?.role === "Admin";
  const counted = check.items.filter((i) => i.counted_quantity !== null).length;

  const handleSubmit = async () => {
    try {
      await deleteCheck(checkId).unwrap();
      toast.success(t("inventory.check.deleteSuccess"));
      navigate("/inventory");
    } catch (e) {
      toast.error(t("inventory.check.deleteError"));
      console.error(e);
    }
  };

  return (
    <FormPage
      title={t("inventory.check.deleteTitle")}
      navigation={navigation}
      backTo={backTo}
      actions={
        <>
          <Button variant="outlined" onClick={() => navigate(backTo)}>
            {t("inventory.action.cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleSubmit}
            loading={isDeleting}
            disabled={!canDelete}
          >
            {t("inventory.check.deleteAction")}
          </LoadingButton>
        </>
      }
    >
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography variant="h6">
            {t("inventory.check.titleWithDate", {
              date: inventoryDateFormat.format(new Date(check.started_at)),
            })}
          </Typography>
          <InventoryCheckStateChip state={check.state} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {inventoryDateTimeFormat.format(new Date(check.started_at))}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("inventory.check.progress", {
            counted,
            total: check.items.length,
          })}
        </Typography>
      </Box>
      <Alert severity="warning">{t("inventory.check.deleteContent")}</Alert>
    </FormPage>
  );
};
