import { alpha, Portal } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { SearchOutlined } from "@mui/icons-material";
import { SearchContent } from "./SearchContent";
import { useTranslation } from "react-i18next";

const StyledSearchDialogWrapper = styled("div")(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1290,
}));

const StyledSearchDialogBackground = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  backdropFilter: "blur(4px)",
}));

const StyledSearchDialogWindow = styled("div")(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "1rem",
  border: `solid 1px ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
  left: "22rem",
  width: "56%",
  top: "15%",
  overflow: "hidden",
}));

const StyledSearchBar = styled("div")(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `solid 1px ${theme.palette.divider}`,
  height: "4rem",
  overflow: "hidden",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
}));

const StyledSearchBarIcon = styled("div")(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "4rem",
  height: "4rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledSearchBarKey = styled("div")(() => ({
  position: "absolute",
  top: 0,
  right: 0,
  width: "4rem",
  height: "4rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.9rem",
  cursor: "pointer",
}));

const StyledSearchBarInput = styled("input")(({ theme }) => ({
  appearance: "none",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  height: "4rem",
  lineHeight: "4rem",
  padding: "0 4rem",
  border: "none",
  outline: "none",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontSize: "1.2rem",
}));

const StyledSearchContent = styled("div")(() => ({
  position: "relative",
  paddingTop: "4rem",
  overflowY: "auto",
  overflowX: "hidden",
}));

export const SearchDialog = (props: { setOpen: (open: boolean) => void }) => {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState("");

  const closeAction = () => props.setOpen(false);

  const handleKeyAction = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeAction();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyAction);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyAction);
      document.body.style.overflow = "auto";
    };
  });

  const preventUpDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Portal>
      <StyledSearchDialogWrapper>
        <StyledSearchDialogBackground onClick={closeAction} />
        <StyledSearchDialogWindow>
          <StyledSearchBar>
            <StyledSearchBarInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={preventUpDown}
              placeholder={t("search.prompt") ?? undefined}
              autoFocus
            />
            <StyledSearchBarIcon>
              <SearchOutlined />
            </StyledSearchBarIcon>
            <StyledSearchBarKey onClick={closeAction}>ESC</StyledSearchBarKey>
          </StyledSearchBar>
          <StyledSearchContent>
            <SearchContent search={search} onClose={closeAction} />
          </StyledSearchContent>
        </StyledSearchDialogWindow>
      </StyledSearchDialogWrapper>
    </Portal>
  );
};
