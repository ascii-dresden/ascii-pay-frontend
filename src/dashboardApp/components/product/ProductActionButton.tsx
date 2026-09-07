import { ProductDto } from "../../../common/contracts";
import React, { useState } from "react";
import { DeleteOutline, Edit, ImageOutlined } from "@mui/icons-material";
import { UpdateProductImageDialog } from "./UpdateProductImageDialog";
import { useTranslation } from "react-i18next";
import { ActionButton, ActionButtonAction } from "../ActionButton";

export const ProductActionButton = (props: {
  product: ProductDto;
  showNavigationOption?: boolean;
  minimize?: boolean;
  zIndex?: number;
}) => {
  const { t } = useTranslation();

  const [openImageModal, setOpenImageModal] = useState(false);

  let actions: ActionButtonAction[] = [
    {
      label: t("product.action.edit"),
      icon: <Edit />,
      href: `/products/${props.product.id}/edit`,
    },
    {
      label: t("product.action.editImage"),
      icon: <ImageOutlined />,
      action: () => setOpenImageModal(true),
    },
    {
      label: t("product.action.deleteProduct"),
      icon: <DeleteOutline />,
      href: `/products/${props.product.id}/delete`,
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
      <ActionButton
        actions={actions}
        minimize={props.minimize}
        zIndex={props.zIndex}
      />

      <UpdateProductImageDialog
        product={props.product}
        open={openImageModal}
        setOpen={setOpenImageModal}
      />
    </>
  );
};
