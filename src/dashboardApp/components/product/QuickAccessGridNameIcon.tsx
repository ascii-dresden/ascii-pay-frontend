import React from "react";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";

const StyledQuickAccessGridNameIcon = styled("div")(({ theme }) => ({
  border: `solid 0.5px ${theme.palette.grey[600]}`,
  display: "flex",
  flexDirection: "column",

  ["& > div"]: {
    display: "flex",
    flexDirection: "row",
  },

  ["&.large"]: {
    borderWidth: "1px",
  },

  ["&.extralarge"]: {
    borderColor: theme.palette.grey[theme.palette.mode === "dark" ? 700 : 400],
    borderWidth: "2px",
  },
}));

const StyledRowItem = styled("div")(({ theme }) => ({
  border: `solid 0.5px ${theme.palette.grey[600]}`,
  width: "0.2em",
  height: "0.2em",
  flexGrow: 1,

  ["&.active"]: {
    background: alpha(theme.palette.primary.main, 0.4),
  },

  ["&.large"]: {
    borderWidth: "1px",
    width: "0.3em",
    height: "0.3em",
  },

  ["&.extralarge"]: {
    borderColor: theme.palette.grey[theme.palette.mode === "dark" ? 700 : 400],
    borderWidth: "2px",
    width: "1.5em",
    height: "1.5em",
  },
}));

export const QuickAccessGridNameIcon = (props: {
  name: string;
  size?: "small" | "large" | "extralarge";
}) => {
  const content: React.ReactElement[] = [];

  for (let row = 0; row < 4; row++) {
    const rowContent: React.ReactElement[] = [];
    for (let col = 0; (row < 3 && col < 3) || (row >= 3 && col < 4); col++) {
      const name = `grid:${row}:${col}`;
      rowContent.push(
        <StyledRowItem
          key={col}
          className={clsx({
            active: props.name === name,
            large: props.size === "large",
            extralarge: props.size === "extralarge",
          })}
        />
      );
    }

    content.push(<div key={row}>{rowContent}</div>);
  }

  return (
    <StyledQuickAccessGridNameIcon
      className={clsx({
        large: props.size === "large",
        extralarge: props.size === "extralarge",
      })}
    >
      {content}
    </StyledQuickAccessGridNameIcon>
  );
};
