import styled from "@emotion/styled";
import React from "react";
import clsx from "clsx";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import {
  RegisterMode,
  setChecklistState,
  setRegisterMode,
  toggleResultMode,
} from "../redux/features/registerSlice";
import { useTranslation } from "react-i18next";

const StyledChecklist = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;

  padding: 1em 0;
  display: flex;
  align-items: center;

  & > div {
    flex-basis: 0;
    flex-grow: 1;
  }
`;
const StyledChecklistItem = styled.div`
  position: relative;
  line-height: 1.4em;
  min-height: 3.2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledChecklistItemName = styled.div`
  display: block;
  white-space: pre;
`;
const StyledChecklistItemHint = styled.div`
  display: block;
  white-space: pre;
  color: var(--secondary-text-color);
  font-size: 0.8em;
  margin-top: -0.3em;
  margin-bottom: -0.4em;
`;
const StyledChecklistItemCheckbox = styled.div`
  position: relative;
  width: 1.8em;
  height: 1.8em;
  border: solid 2px var(--secondary-text-color);
  border-radius: 0.2em;
  background-color: var(--secondary-hover-background);
  flex-shrink: 0;

  span {
    position: absolute;
    display: block;
    width: 1.8em;
    height: 1em;
    border-left: solid 0.25em var(--theme-color);
    border-bottom: solid 0.25em var(--theme-color);
    rotate: -50deg;
    margin-left: 0.7em;
    margin-top: 0.2em;
    transform-origin: 20% 80%;
    opacity: 0;
    scale: 0.2;
    transition: opacity 80ms linear, scale 80ms ease;
  }

  &.isChecked span {
    opacity: 1;
    scale: 1;
  }

  &.isSmall {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.3em;

    &::before {
      content: "";
      position: absolute;
      background-color: var(--primary-text-color);
      opacity: 0.05;
      top: calc(-2em + 2px);
      left: 0.4em;
      width: 0.2em;
      height: calc(2em - 8px);
    }

    & span {
      width: 1.2em;
      height: 0.6em;
      border-width: 0.2em;
      margin-left: 0.4em;
      margin-top: 0.1em;
    }
  }

  &.isSmall.isFirst::before {
    top: calc(-2em + 8px);
    height: calc(2em - 14px);
  }
`;
const StyledChecklistGroup = styled.div`
  padding: 0 1em;
`;
const StyledChecklistSteps = styled.div`
  padding-left: 1.6em;

  & > div::before {
    content: "";
    position: absolute;
    margin-top: -0.2em;
    margin-left: -1em;
    width: 0.3em;
    height: 0.3em;
    border-radius: 100%;
    background-color: var(--primary-text-color);
    opacity: 0.5;
  }
`;
const StyledChecklistProgress = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 0.2em;
  transition: width 0.2s;
  background-color: var(--theme-color);
`;

type Item = {
  key?: string;
  name: string;
  hint?: string;
  steps?: ItemStep[];
};

type ItemStep = {
  key: string;
  name: string;
  hint?: string;
};

export const ChecklistProgress = () => {
  const { t } = useTranslation();
  const isRegisterFinished = useTerminalSelector(
    (state) => state.registerState.previous !== null
  );
  const checklistState = useTerminalSelector(
    (state) => state.registerState.checklist
  );

  let itemCount = 0;
  let checkedCount = 0;

  const rules = t("checklist:columns", { returnObjects: true }) as Item[][];
  for (let column of rules) {
    for (let item of column) {
      if (item.key) {
        itemCount += 1;

        if (
          (item.key === "register" && isRegisterFinished) ||
          checklistState[item.key]
        ) {
          checkedCount += 1;
        }
      }
      for (let step of item.steps ?? []) {
        if (step.key) {
          itemCount += 1;

          if (
            (step.key === "register" && isRegisterFinished) ||
            checklistState[step.key]
          ) {
            checkedCount += 1;
          }
        }
      }
    }
  }

  let width = (checkedCount / itemCount) * 100 + "%";
  return <StyledChecklistProgress style={{ width: width }} />;
};

export const Checklist = () => {
  const { t } = useTranslation();
  const rules = t("checklist:columns", { returnObjects: true }) as Item[][];
  const views = rules.map((items, col) => (
    <div key={col}>
      {items.map((item, i) => (
        <ChecklistGroup key={i} item={item} />
      ))}
    </div>
  ));
  return <StyledChecklist>{views}</StyledChecklist>;
};

const ChecklistGroup = (props: { item: Item }) => {
  let steps;
  if (props.item.steps && props.item.steps.length > 0) {
    steps = props.item.steps.map((step, i) => (
      <ChecklistItem key={i} item={step} small first={i === 0} />
    ));
  }
  return (
    <StyledChecklistGroup>
      <ChecklistItem item={props.item} />
      {steps ? <StyledChecklistSteps>{steps}</StyledChecklistSteps> : null}
    </StyledChecklistGroup>
  );
};

const ChecklistItem = (props: {
  item: Item;
  small?: boolean;
  first?: boolean;
}) => {
  const isRegisterFinished = useTerminalSelector(
    (state) => state.registerState.previous !== null
  );
  const checklistState = useTerminalSelector(
    (state) => state.registerState.checklist
  );
  const dispatch = useTerminalDispatch();

  let isChecked;
  let toggleChecked;

  if (props.item.key === undefined) {
    isChecked = true;
    for (let s of props.item.steps ?? []) {
      if (!checklistState[s.key]) {
        isChecked = false;
        break;
      }
    }

    const toggledChecked = !isChecked;
    toggleChecked = () => {
      let newState = { ...checklistState };
      for (let s of props.item.steps ?? []) {
        newState[s.key] = toggledChecked;
      }
      dispatch(setChecklistState(newState));
    };
  } else if (props.item.key === "register") {
    isChecked = isRegisterFinished;

    if (isChecked) {
      toggleChecked = () => {
        dispatch(toggleResultMode());
      };
    } else {
      toggleChecked = () => {
        dispatch(setRegisterMode(RegisterMode.COINS));
      };
    }
  } else {
    isChecked = checklistState[props.item.key] === true;
    const toggledChecked = !isChecked;
    toggleChecked = () => {
      if (props.item.key) {
        let newState = { ...checklistState };
        newState[props.item.key] = toggledChecked;
        dispatch(setChecklistState(newState));
      }
    };
  }

  return (
    <StyledChecklistItem onClick={toggleChecked}>
      <div>
        <StyledChecklistItemName>{props.item.name}</StyledChecklistItemName>
        {props.item.hint ? (
          <StyledChecklistItemHint>{props.item.hint}</StyledChecklistItemHint>
        ) : null}
      </div>
      <StyledChecklistItemCheckbox
        className={clsx({
          isChecked: isChecked,
          isSmall: props.small,
          isFirst: props.first,
        })}
      >
        <span></span>
      </StyledChecklistItemCheckbox>
    </StyledChecklistItem>
  );
};
