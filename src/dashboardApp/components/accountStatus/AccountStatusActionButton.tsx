import { AccountStatusDto } from "../../../common/contracts";
import React, { useState } from "react";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { UpdateAccountStatusDialog } from "./UpdateAccountStatusDialog";
import { DeleteAccountStatusDialog } from "./DeleteAccountStatusDialog";
import { useTranslation } from "react-i18next";
import { ActionButton, ActionButtonAction } from "../ActionButton";

export const AccountStatusActionButton = (props: {
  accountStatus: AccountStatusDto;
  showNavigationOption?: boolean;
  minimize?: boolean;
  zIndex?: number;
}) => {
  const { t } = useTranslation();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  let actions: ActionButtonAction[] = [
    {
      label: t("accountStatus.action.edit"),
      icon: <Edit />,
      action: () => setOpenEditModal(true),
    },
    {
      label: t("accountStatus.action.deleteAccountStatus"),
      icon: <DeleteOutline />,
      action: () => setOpenDeleteModal(true),
    },
  ];

  if (props.showNavigationOption) {
    actions.splice(0, 0, {
      label: t("accountStatus.action.details"),
      href: `/accountStatus/${props.accountStatus.id}`,
    });
  }

  return (
    <>
      <ActionButton
        actions={actions}
        minimize={props.minimize}
        zIndex={props.zIndex}
      />

      <UpdateAccountStatusDialog
        accountStatus={props.accountStatus}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <DeleteAccountStatusDialog
        accountStatus={props.accountStatus}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};
