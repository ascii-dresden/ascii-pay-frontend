import * as React from "react";
import styled from "@emotion/styled";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { Close } from "@mui/icons-material";

const StyledDialog = styled.div`
  position: absolute;
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
const StyledDialogCancel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 4em !important;
  height: 3em;
  line-height: 3em;
  text-align: center;
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 0;

  width: 100%;
  border: solid 1px var(--border-color);
  border-radius: 0;
  color: var(--primary-text-color);
  padding: 0.4em 0.8em;
  font-size: 0.9em;
  background-color: var(--tertiary-hover-background);

  &:hover {
    background-color: var(--secondary-background);
  }

  &:focus {
    background-color: var(--secondary-background);
    border-color: var(--theme-color);
    box-shadow: 0 0 0 1px var(--theme-color);
    outline: none;
  }

  &:disabled {
    background-color: var(--tertiary-background);

    &:hover {
      background-color: var(--tertiary-hover-background);
    }
  }
`;

const StyledSpinner = styled.div`
  padding: 0 0.5em;

  div {
    border: solid 0.1em var(--primary-text-color);
    border-right-color: transparent;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    animation: rotate 1s infinite linear;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Dialog = (props: {
  title: string;
  children: any;
  actions: {
    label: string;
    isLoading?: boolean;
    action: () => void;
  }[];
  large?: boolean;
  onClose?: () => void;
}) => {
  let actions = props.actions.map(({ label, action, isLoading }) => {
    return (
      <StyledDialogAction key={label} onClick={() => action()}>
        {isLoading ? (
          <StyledSpinner>
            <div></div>
          </StyledSpinner>
        ) : null}
        {label}
      </StyledDialogAction>
    );
  });

  const content = (
    <StyledDialog>
      <StyledDialogBody
        className={clsx({
          "dialog-width": props.large,
        })}
      >
        {props.onClose ? (
          <StyledDialogCancel onClick={props.onClose}>
            <Close />
          </StyledDialogCancel>
        ) : null}
        <StyledDialogTitle>{props.title}</StyledDialogTitle>
        <StyledDialogContent>{props.children}</StyledDialogContent>
        <StyledDialogActions>{actions}</StyledDialogActions>
      </StyledDialogBody>
    </StyledDialog>
  );

  const container = document.getElementById("terminal-dialog-portal");
  return createPortal(content, container!);
};
