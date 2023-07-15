import { ProductDto } from "../../../common/contracts";
import React, { useState } from "react";
import { DeleteOutline, Edit, ImageOutlined } from "@mui/icons-material";
import { UpdateProductImageDialog } from "./UpdateProductImageDialog";
import { UpdateProductDialog } from "./UpdateProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { useTranslation } from "react-i18next";
import { ActionButton, ActionButtonAction } from "../ActionButton";

export const ProductActionButton = (props: {
  product: ProductDto;
  showNavigationOption?: boolean;
  minimize?: boolean;
}) => {
  const { t } = useTranslation();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  let actions: ActionButtonAction[] = [
    {
      label: t("product.action.edit"),
      icon: <Edit />,
      action: () => setOpenEditModal(true),
    },
    {
      label: t("product.action.editImage"),
      icon: <ImageOutlined fontSize="small" />,
      action: () => setOpenImageModal(true),
    },
    {
      label: t("product.action.deleteProduct"),
      icon: <DeleteOutline fontSize="small" />,
      action: () => setOpenDeleteModal(true),
    },
  ];

  if (props.showNavigationOption) {
    actions.splice(0, 0, {
      label: t("product.action.details"),
      href: `/products/${props.product.id}`,
    });
  }

  return (
    <>
      <ActionButton actions={actions} minimize={props.minimize} />

      <UpdateProductImageDialog
        product={props.product}
        open={openImageModal}
        setOpen={setOpenImageModal}
      />

      <UpdateProductDialog
        product={props.product}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <DeleteProductDialog
        product={props.product}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};
