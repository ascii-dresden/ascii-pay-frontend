import { PurchaseDto } from "../../../common/contracts";
import React from "react";
import {
  DeleteOutline,
  Edit,
  LockOpenOutlined,
  LockOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ActionButton, ActionButtonAction } from "../ActionButton";
import { useDashboardSelector } from "../../redux/dashboardStore";

/**
 * Purchase actions. Every entry navigates to a dedicated page under
 * `/purchases/:id/...` instead of opening a dialog.
 */
export const PurchaseActionButton = (props: {
  purchase: PurchaseDto;
  showNavigationOption?: boolean;
  minimize?: boolean;
  zIndex?: number;
}) => {
  const { t } = useTranslation();
  const user = useDashboardSelector((state) => state.userState.user);
  const isAdmin = user?.role === "Admin";
  const isDraft = props.purchase.state === "draft";
  const base = `/purchases/${props.purchase.id}`;

  let actions: ActionButtonAction[] = [];

  if (props.showNavigationOption) {
    actions.push({
      label: t("purchase.action.details"),
      href: base,
    });
  }

  if (isDraft) {
    actions.push({
      label: t("purchase.action.continueShopping"),
      icon: <ShoppingCartOutlined />,
      href: `${base}/shop`,
    });
    actions.push({
      label: t("purchase.action.finalize"),
      icon: <LockOutlined />,
      href: `${base}/finalize`,
    });
    actions.push({
      label: t("purchase.action.edit"),
      icon: <Edit />,
      href: `${base}/edit`,
    });
  } else if (isAdmin) {
    actions.push({
      label: t("purchase.action.reopen"),
      icon: <LockOpenOutlined />,
      href: `${base}/reopen`,
    });
  }

  if (isDraft || isAdmin) {
    actions.push({
      label: t("purchase.action.deletePurchase"),
      icon: <DeleteOutline />,
      href: `${base}/delete`,
    });
  }

  return (
    <ActionButton
      actions={actions}
      minimize={props.minimize}
      zIndex={props.zIndex}
    />
  );
};
