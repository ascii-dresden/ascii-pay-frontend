import { AccountDto } from "../../../common/contracts";
import React, { useState } from "react";
import {
  DeleteOutline,
  Edit,
  LockOutlined,
  ShoppingCartOutlined,
  Token,
  Wallet,
} from "@mui/icons-material";
import { UpdateAccountDialog } from "./UpdateAccountDialog";
import { CreatePaymentDialog } from "../transaction/CreatePaymentDialog";
import { AccountAuthenticationDialog } from "./AccountAuthenticationDialog";
import { AccountSessionDialog } from "./AccountSessionDialog";
import { useTranslation } from "react-i18next";
import { useDashboardSelector } from "../../redux/dashboardStore";
import { ActionButton, ActionButtonAction } from "../ActionButton";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export const AccountActionButton = (props: {
  account: AccountDto;
  showNavigationOption?: boolean;
  showOptionsForOwnAccount?: boolean;
  minimize?: boolean;
  zIndex?: number;
}) => {
  const { t } = useTranslation();

  const token = useDashboardSelector((state) => state.userState.token);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openSessionModal, setOpenSessionModal] = useState(false);

  let actions: ActionButtonAction[] = [
    {
      label: t("account.action.payment"),
      icon: <ShoppingCartOutlined />,
      action: () => setOpenPaymentModal(true),
    },
    {
      label: t("account.action.editAccount"),
      icon: <Edit />,
      action: () => setOpenEditModal(true),
    },
    {
      label: t("account.action.authenticationMethods"),
      icon: <LockOutlined />,
      action: () => setOpenAuthModal(true),
    },
    {
      label: t("account.action.activeSessions"),
      icon: <Token />,
      action: () => setOpenSessionModal(true),
    },
    {
      label: t("account.action.deleteAccount"),
      icon: <DeleteOutline />,
      action: () => setOpenDeleteModal(true),
    },
  ];

  if (props.showNavigationOption) {
    actions.splice(0, 0, {
      label: t("account.action.details"),
      href: `/accounts/${props.account.id}`,
    });
  }

  if (token && props.showOptionsForOwnAccount) {
    actions.push({
      label: t("account.action.appleWallet"),
      icon: <Wallet />,
      href: `/v1/asciipay.pkpass?session_token=${token}`,
    });
  }

  return (
    <>
      <ActionButton
        actions={actions}
        minimize={props.minimize}
        zIndex={props.zIndex}
      />

      <UpdateAccountDialog
        account={props.account}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <DeleteAccountDialog
        account={props.account}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />

      <CreatePaymentDialog
        account={props.account}
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
      />

      <AccountAuthenticationDialog
        account={props.account}
        open={openAuthModal}
        setOpen={setOpenAuthModal}
      />

      <AccountSessionDialog
        account={props.account}
        open={openSessionModal}
        setOpen={setOpenSessionModal}
      />
    </>
  );
};
