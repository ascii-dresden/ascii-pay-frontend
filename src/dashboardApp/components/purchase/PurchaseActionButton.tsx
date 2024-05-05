import { PurchaseDto } from "../../../common/contracts";
import React, { useState } from "react";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { UpdatePurchaseDialog } from "./UpdatePurchaseDialog";
import { DeletePurchaseDialog } from "./DeletePurchaseDialog";
import { useTranslation } from "react-i18next";
import { ActionButton, ActionButtonAction } from "../ActionButton";

export const PurchaseActionButton = (props: {
  purchase: PurchaseDto;
  showNavigationOption?: boolean;
  minimize?: boolean;
  zIndex?: number;
}) => {
  const { t } = useTranslation();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  let actions: ActionButtonAction[] = [
    {
      label: t("purchase.action.edit"),
      icon: <Edit />,
      action: () => setOpenEditModal(true),
    },
    {
      label: t("purchase.action.deletePurchase"),
      icon: <DeleteOutline />,
      action: () => setOpenDeleteModal(true),
    },
  ];

  if (props.showNavigationOption) {
    actions.splice(0, 0, {
      label: t("purchase.action.details"),
      href: `/purchases/${props.purchase.id}`,
    });
  }

  return (
    <>
      <ActionButton
        actions={actions}
        minimize={props.minimize}
        zIndex={props.zIndex}
      />

      <UpdatePurchaseDialog
        purchase={props.purchase}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <DeletePurchaseDialog
        purchase={props.purchase}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};
