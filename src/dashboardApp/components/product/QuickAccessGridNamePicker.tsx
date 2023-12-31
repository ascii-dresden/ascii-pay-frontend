import React from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { alpha } from "@mui/material";

const StyledQuickAccessGridNamePicker = styled("div")(() => ({
  display: "flex",
  gap: "0.5em",
  flexDirection: "column",
  padding: "0.5em",

  ["& > div"]: {
    display: "flex",
    gap: "0.5em",
    flexDirection: "row",
  },
}));

const StyledRowItem = styled("div")(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[500]}`,
  borderRadius: "0.2em",
  width: "4em",
  height: "4em",
  lineHeight: "4em",
  flexGrow: 1,
  textAlign: "center",
  cursor: "pointer",

  ["&.active"]: {
    background: alpha(theme.palette.primary.main, 0.1),
    fontWeight: "bold",
  },
  ["&:hover"]: {
    background: alpha(theme.palette.grey[500], 0.1),
    borderColor: theme.palette.grey[700],
    ["&.active"]: {
      background: alpha(theme.palette.primary.main, 0.2),
    },
  },
}));

export const QuickAccessGridNamePicker = (props: {
  name: string;
  onChange: (name: string) => void;
}) => {
  const content: React.ReactElement[] = [];

  for (let row = 0; row < 4; row++) {
    const rowContent: React.ReactElement[] = [];
    for (let col = 0; (row < 3 && col < 3) || (row >= 3 && col < 4); col++) {
      rowContent.push(
        <RowItem
          key={col}
          row={row}
          col={col}
          currentName={props.name}
          onChange={props.onChange}
        />
      );
    }

    content.push(<div key={row}>{rowContent}</div>);
  }

  return (
    <StyledQuickAccessGridNamePicker>{content}</StyledQuickAccessGridNamePicker>
  );
};

const RowItem = (props: {
  currentName: string;
  row: number;
  col: number;
  onChange: (name: string) => void;
}) => {
  const shortName = `${props.row}:${props.col}`;
  const name = `grid:${shortName}`;
  return (
    <StyledRowItem
      className={clsx({ active: props.currentName === name })}
      onClick={() => props.onChange(name)}
      title={name}
    >
      {shortName}
    </StyledRowItem>
  );
};
