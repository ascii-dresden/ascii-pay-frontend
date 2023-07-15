import { AccountDto } from "../../../common/contracts";
import React, { useState } from "react";
import {
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

export const AccountActionButton = (props: {
  account: AccountDto;
  showNavigationOption?: boolean;
  showOptionsForOwnAccount?: boolean;
  minimize?: boolean;
}) => {
  const { t } = useTranslation();

  const token = useDashboardSelector((state) => state.userState.token);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
      icon: <Edit fontSize="small" />,
      action: () => setOpenEditModal(true),
    },
    {
      label: t("account.action.authenticationMethods"),
      icon: <LockOutlined fontSize="small" />,
      action: () => setOpenAuthModal(true),
    },
    {
      label: t("account.action.activeSessions"),
      icon: <Token fontSize="small" />,
      action: () => setOpenSessionModal(true),
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
      icon: <Wallet fontSize="small" />,
      href: `/v1/asciipay.pkpass?session_token=${token}`,
    });
  }

  return (
    <>
      <ActionButton actions={actions} minimize={props.minimize} />

      <UpdateAccountDialog
        account={props.account}
        open={openEditModal}
        setOpen={setOpenEditModal}
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
