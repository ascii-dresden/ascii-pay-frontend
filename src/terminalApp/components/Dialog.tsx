import * as React from "react";
import styled from "@emotion/styled";
import clsx from "clsx";

const StyledDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: black;
    opacity: 0.5;
  }
`;
const StyledDialogBody = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20em;
  margin-left: -10em;
  height: 24em;
  margin-top: -12em;
  background-color: var(--secondary-background);
  border: solid 1px var(--border-color);
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > div {
    width: 100%;
  }

  &.dialog-width {
    width: 36em;
    margin-left: -18em;
  }
`;
const StyledDialogTitle = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  line-height: 3em;
  text-align: center;
`;
const StyledDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16em;

  & > div {
    width: 100%;
    padding: 0;
  }
`;
const StyledDialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
`;

const StyledDialogAction = styled.button`
  flex: 1 1 auto;
`;

export const Dialog = (props: {
  title: string;
  children: any;
  actions: {
    label: string;
    action: () => void;
  }[];
  large?: boolean;
}) => {
  let actions = props.actions.map(({ label, action }) => {
    return (
      <StyledDialogAction key={label} onClick={() => action()}>
        {label}
      </StyledDialogAction>
    );
  });

  return (
    <StyledDialog>
      <StyledDialogBody
        className={clsx({
          "dialog-width": props.large,
        })}
      >
        <StyledDialogTitle>{props.title}</StyledDialogTitle>
        <StyledDialogContent>{props.children}</StyledDialogContent>
        <StyledDialogActions>{actions}</StyledDialogActions>
      </StyledDialogBody>
    </StyledDialog>
  );
};
