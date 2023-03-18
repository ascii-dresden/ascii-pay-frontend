import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useDeleteProductImageMutation,
  useUpdateProductImageMutation,
} from "../../redux/api/productApi";
import { ProductDto } from "../../../common/contracts";
import { Close } from "@mui/icons-material";
import { BASE_URL } from "../../redux/api/customFetchBase";
import styled from "@emotion/styled";
import clsx from "clsx";

const StyledImageContainer = styled.div`
  height: 8rem;
  width: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px #666;
  overflow: hidden;
`;

const StyledImage = styled.img`
  max-height: 8rem;
  max-width: 8rem;
`;

const StyledInput = styled.input`
  display: none;
`;

const StyledLabel = styled.label`
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 1rem;
  border-style: dashed;
  border-color: #666;
  background-color: transparent;
  min-width: 20rem;

  & > div {
    text-align: center;
  }

  &.dragActive {
    border-color: #1565c0;
    border-width: 4px;
  }
`;

export const UpdateProductImageDialog = (props: {
  product: ProductDto;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [
    updateProductImage,
    {
      isLoading: updateIsLoading,
      isError: updateIsError,
      error: updateError,
      isSuccess: updateIsSuccess,
    },
  ] = useUpdateProductImageMutation();
  const [
    deleteProductImage,
    {
      isLoading: deleteIsLoading,
      isError: deleteIsError,
      error: deleteError,
      isSuccess: deleteIsSuccess,
    },
  ] = useDeleteProductImageMutation();

  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<{
    file: File | null;
    delete: boolean;
    image: string;
  }>({
    file: null,
    delete: false,
    image: `${BASE_URL}/product/${props.product.id}/image`,
  });

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("Product image updated successfully!");
      props.setOpen(false);
    } else if (updateIsError) {
      toast.error("Product image could not be updated!");
      console.error(updateError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateIsLoading]);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Product image deleted successfully!");
      props.setOpen(false);
    } else if (deleteIsError) {
      toast.error("Product image could not be deleted!");
      console.error(deleteError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteIsLoading]);

  const handleSubmit = () => {
    if (image.file) {
      let formData = new FormData();
      formData.append(image.file.name, image.file, image.file.name);

      updateProductImage({
        id: props.product.id,
        content: formData,
      });
    } else if (image.delete) {
      deleteProductImage(props.product.id);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage({
        file: img,
        delete: false,
        image: URL.createObjectURL(img),
      });
    }
  };

  const handleDrag = function (e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let img = e.dataTransfer.files.item(0);
      if (img) {
        setImage({
          file: img,
          delete: false,
          image: URL.createObjectURL(img),
        });
      }
    }
  };
  const handleRemoveImage = () => {
    setImage({
      file: null,
      delete: true,
      image: "",
    });
  };

  const handleButtonClick = () => {
    inputRef.current!.click();
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullScreen={fullScreen}
    >
      <DialogTitle component="div">
        <Typography variant="h5">Edit product image</Typography>
        <IconButton
          aria-label="close"
          onClick={() => props.setOpen(false)}
          sx={{
            position: "absolute",
            right: 16,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box pt={1}>
          <Box sx={{ display: "flex" }}>
            <Box>
              <StyledImageContainer>
                <StyledImage alt="" src={image?.image} />
              </StyledImageContainer>
              <Button onClick={handleRemoveImage} color="error" fullWidth>
                Remove image
              </Button>
            </Box>
            <Box sx={{ ml: 2 }}>
              <StyledInput
                ref={inputRef}
                type="file"
                id="input-file-upload"
                onChange={handleImageChange}
                accept="image/jpg, image/png, image/jpeg, image/svg, image/svg+xml"
              />
              <StyledLabel
                htmlFor="input-file-upload"
                className={clsx({ dragActive })}
                onClick={handleButtonClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div>
                  <Typography>Drag and drop your file here</Typography>
                  <Typography>or click to select file</Typography>
                </div>
              </StyledLabel>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          fullWidth
          sx={{ mx: 2, py: 1.5 }}
          onClick={handleSubmit}
          loading={updateIsLoading || deleteIsLoading}
          disabled={!image.delete && image.file === null}
        >
          Save changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
