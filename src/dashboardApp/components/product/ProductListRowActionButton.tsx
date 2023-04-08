import { ProductDto } from "../../../common/contracts";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Divider,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import {
  DeleteOutline,
  Edit,
  ImageOutlined,
  MoreVert,
} from "@mui/icons-material";
import { UpdateProductImageDialog } from "./UpdateProductImageDialog";
import { UpdateProductDialog } from "./UpdateProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { useTranslation } from "react-i18next";

export const ProductListRowActionButton = (props: {
  product: ProductDto;
  hidePrimaryAction?: boolean;
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleMenuItemClick = (action: (value: boolean) => void) => {
    action(true);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="outlined"
        size="large"
        ref={anchorRef}
        aria-label="split button"
      >
        {props.hidePrimaryAction ? null : (
          <Button component={Link} to={`/products/${props.product.id}`}>
            {t("product.action.details")}
          </Button>
        )}
        <Button
          component="a"
          sx={{ whiteSpace: "nowrap", width: "3.5rem" }}
          onClick={handleToggle}
        >
          <MoreVert />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenImageModal)}
                  >
                    <ListItemIcon>
                      <ImageOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("product.action.editImage")}</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenEditModal)}
                  >
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {t("product.action.editProduct")}
                    </ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => handleMenuItemClick(setOpenDeleteModal)}
                  >
                    <ListItemIcon>
                      <DeleteOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {t("product.action.deleteProduct")}
                    </ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

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
