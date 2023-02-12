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

interface IAccountItemProps {
  account: AccountDto;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  console.log(color);
  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
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
        <TableCell align="right">{JSON.stringify(account.balance)}</TableCell>
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
