import React from "react";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { SearchDialog } from "./SearchDialog";
import { useTranslation } from "react-i18next";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  border: `solid 1px ${theme.palette.divider}`,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  height: "2.2rem",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
    minWidth: "15rem",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const SearchTextWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  flexGrow: 1,
}));

const SearchKeyWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2, 0, 4),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.9rem",
}));

export const SearchButton = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleAction = () => {
    setOpen((o) => !o);
  };

  const handleKeyAction = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "k") {
        event.preventDefault();
        event.stopPropagation();
        handleAction();
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyAction);
    return () => window.removeEventListener("keydown", handleKeyAction);
  });

  return (
    <>
      <SearchContainer onClick={handleAction}>
        <SearchIconWrapper>
          <SearchOutlined />
        </SearchIconWrapper>
        <SearchTextWrapper>{t("search.prompt")}</SearchTextWrapper>
        <SearchKeyWrapper>⌘K</SearchKeyWrapper>
      </SearchContainer>
      {open ? <SearchDialog setOpen={setOpen} /> : null}
    </>
  );
};
