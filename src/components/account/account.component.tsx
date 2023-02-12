import {
  Avatar,
  Button,
  ButtonGroup,
  TableCell,
  TableRow,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDeleteAccountMutation } from "../../redux/api/accountApi";
import { toast } from "react-toastify";
import UpdateAccount from "./update-account";
import { AccountDto } from "../../redux/api/contracts";
import { stringAvatar } from "../stringAvatar";
import { CoinAmountView } from "../CoinAmountView";

interface IAccountItemProps {
  account: AccountDto;
}

const AccountItem: FC<IAccountItemProps> = ({ account }) => {
  const [openModal, setOpenModal] = useState(false);
  const [deleteAccount, { isLoading, error, isSuccess, isError }] =
    useDeleteAccountMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account deleted successfully");
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onDeleteHandler = (id: number) => {
    if (window.confirm("Are you sure")) {
      deleteAccount(id);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Avatar alt={account.name} {...stringAvatar(account.name)} />
        </TableCell>
        <TableCell>{account.name}</TableCell>
        <TableCell>{account.email}</TableCell>
        <TableCell>{account.role}</TableCell>
        <TableCell align="right">
          <CoinAmountView coins={account.balance} />
        </TableCell>
        <TableCell align="right">
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => setOpenModal(true)}>Edit</Button>
            <Button onClick={() => onDeleteHandler(account.id)}>Delete</Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <UpdateAccount
        account={account}
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
};

export default AccountItem;
