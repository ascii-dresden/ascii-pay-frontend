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

  &.isChecked span {
    position: absolute;
    display: block;
    width: 1.8em;
    height: 1em;
    border-left: solid 0.25em var(--theme-color);
    border-bottom: solid 0.25em var(--theme-color);
    rotate: -50deg;
    translate: 0.1em -0.1em;
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

const rules: Item[][] = [
  [
    {
      name: "Kaffeemaschine reinigen",
      steps: [
        {
          key: "coffee_machine_milk_carton",
          name: "Milch in Kühlschrank lagern",
          hint: "Deckel schließen und mit Datum beschriften",
        },
        {
          key: "coffee_machine_milk_hose",
          name: "Milchschlauch reinigen",
          hint: "Milchverklebungen mit Lappen entfernen",
        },
        {
          key: "coffee_machine_milk_fridge",
          name: "Milchkühlschrank reinigen",
          hint: "Ausschalten und Tür offen lassen",
        },
        {
          key: "coffee_machine_choco",
          name: "Schoko-System reinigen",
          hint: "Anschließend Veriegelung sicherstellen",
        },
        {
          key: "coffee_machine_nozzle",
          name: "Kaffee- & Milchdüsen reinigen",
          hint: "Bitte Zahnbürste benutzen",
        },
        {
          key: "coffee_machine_drain",
          name: "Ablaufgitter reinigen",
          hint: "Ablauf nach Reinigung auswischen",
        },
      ],
    },
    {
      key: "trash_can",
      name: "Müll entsorgen",
      hint: "Neue Müllbeutel in Mülleimer einlegen",
    },
    { key: "register", name: "Kasse zählen", hint: "Kassenzähltool öffnen" },
  ],
  [
    {
      name: "Küche reinigen",
      steps: [
        {
          key: "kitchen_countertop",
          name: "Arbeitsplatte aufräumen und reinigen",
          hint: "Geschirr und Wäsche wegräumen",
        },
        {
          key: "kitchen_sink",
          name: "Beide Spülbecken reinigen",
          hint: "Unter Metallablage darf kein Wasser stehen",
        },
        {
          key: "kitchen_dishwasher",
          name: "Geschirrspüler anschalten",
          hint: "Auch wenn nur wenig gefüllt",
        },
        {
          key: "kitchen_fridge",
          name: "Kühlschrank auffüllen",
          hint: "Datum der offenen Milch kontrollieren",
        },
      ],
    },
    {
      name: "Café reinigen",
      steps: [
        {
          key: "main_tabletop",
          name: "Tische & Tresen reinigen",
          hint: "Besonders auf Sirupspender achten",
        },
        {
          key: "main_cereals",
          name: "Müsliplatz reinigen",
          hint: "Ggf. Müsli und Snacks auffüllen",
        },
        {
          key: "main_floor",
          name: "Fussboden saugen & wischen",
          hint: "Auch in Ecken & hinter Türen",
        },
      ],
    },
  ],
];

export const ChecklistProgress = () => {
  const isRegisterFinished = useTerminalSelector(
    (state) => state.registerState.previous !== null
  );
  const checklistState = useTerminalSelector(
    (state) => state.registerState.checklist
  );

  let itemCount = 0;
  let checkedCount = 0;

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
