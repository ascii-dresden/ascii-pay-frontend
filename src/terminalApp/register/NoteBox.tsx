import React, { useEffect, useState } from "react";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import {
  setNote10,
  setNote100,
  setNote20,
  setNote5,
  setNote50,
} from "../redux/features/registerSlice";
import { Money, moneyToString } from "../components/Money";
import styled from "@emotion/styled";
import note5 from "../../assets/register/note5.png";
import note10 from "../../assets/register/note10.png";
import note20 from "../../assets/register/note20.png";
import note50 from "../../assets/register/note50.png";
import note100 from "../../assets/register/note100.png";

const StyledNoteBox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;

  background-color: #424242;
  color: #fff;
  padding: 1.5em;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-gap: 0.4em;
  touch-action: none;

  & > div > div > span {
    display: block;
    font-weight: 800;
    padding-bottom: 0.2em;
  }

  .note-stack-group {
    height: 25.7em;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    width: 8em;
    padding-bottom: 1em;
  }

  .note {
    width: 8em;
    height: 4em;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    transition: margin-bottom 0.4s, filter 0.4s;

    img {
      width: 100%;
    }

    &:not(:first-of-type) {
      margin-bottom: -3em;
    }

    &:not(.previous) ~ .previous {
      margin-bottom: -2em;
    }

    &.previous {
      filter: grayscale(100%);

      & ~ .previous {
        margin-bottom: -3em;
      }
    }

    &.empty {
      filter: grayscale(0);
      opacity: 0.2;
    }
  }

  .note-group-sum {
    position: relative;
    line-height: 1.1em;
    height: 1.1em;

    & > span:first-of-type {
      position: absolute;
      left: 0;
      width: 5em;
      text-align: center;
    }

    & > span:last-of-type {
      position: absolute;
      right: 0;
      font-size: 0.8em;
    }
  }

  // Group notes in stacks of 5
  // .note-bundle:not(:last-of-type):not(:nth-last-of-type(1)):not(:nth-last-of-type(2)):not(:nth-last-of-type(3)):not(:nth-last-of-type(4)) {
  //   & + .note,
  //   & + .note + .note,
  //   & + .note + .note + .note,
  //   & + .note + .note + .note + .note {
  //     margin-bottom: -3.9em !important;
  //   }

  //   & + .note + .note + .note + .note + .note {
  //     margin-bottom: -2.5em !important;
  //   }
  // }
`;

const NoteGroup = (props: {
  name: string;
  image: string;
  centValue: number;
  count: number;
  previousCount: number;
}) => {
  const stacks = Array.from(
    { length: Math.max(1, Math.max(props.count, props.previousCount)) },
    (_, noteIndex) => {
      let classList = "note";
      if (noteIndex >= props.count) {
        classList += " previous";

        if (noteIndex >= props.previousCount) {
          classList += " empty";
        }
      }

      if (noteIndex % 5 === 0) {
        classList += " note-bundle";
      }

      let rotation = ((props.centValue + noteIndex * 3) % 7) - 3;
      return (
        <img
          src={props.image}
          alt={moneyToString(props.centValue)}
          key={noteIndex}
          className={classList}
          draggable={false}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      );
    }
  );

  return (
    <div
      className={"note-group note-group-" + props.centValue}
      data-value={props.centValue}
    >
      <span>{props.name}</span>
      <div className="note-stack-group">{stacks}</div>
      <div className="note-group-sum">
        <span>{props.count}</span>
        <Money value={props.count * props.centValue} />
      </div>
    </div>
  );
};

export const NoteBox = (props: {
  setAppClass: (appClass: string | null) => void;
}) => {
  const noteBox = useTerminalSelector((state) => state.registerState.noteBox);
  const previousNoteBox = useTerminalSelector(
    (state) => state.registerState.previous?.noteBox
  );
  const dispatch = useTerminalDispatch();

  const [selectedGroup, setSelectedGroup] = useState(
    null as {
      cents: number;
      noteHeight: number;
      top: number;
      height: number;
      offset: number;
    } | null
  );

  useEffect(() => {
    props.setAppClass("note-box-body");
    return () => {
      props.setAppClass(null);
    };
  }, [props.setAppClass]);

  const getNoteCount = (cents: number) => {
    switch (cents) {
      case 10000:
        return noteBox.note100;
      case 5000:
        return noteBox.note50;
      case 2000:
        return noteBox.note20;
      case 1000:
        return noteBox.note10;
      case 500:
        return noteBox.note5;
    }
    return 0;
  };

  const setNoteCount = (cents: number, count: number) => {
    if (isNaN(count) || !isFinite(count)) {
      count = 0;
    }

    switch (cents) {
      case 10000:
        dispatch(setNote100(count));
        break;
      case 5000:
        dispatch(setNote50(count));
        break;
      case 2000:
        dispatch(setNote20(count));
        break;
      case 1000:
        dispatch(setNote10(count));
        break;
      case 500:
        dispatch(setNote5(count));
        break;
    }
  };

  const handleTab = (event: HammerInput) => {
    if (previousNoteBox) return;
    let currentElement: HTMLElement | null = event.target;
    let targetCents = 0;
    let targetTop = 0;
    let targetHeight = 0;

    while (currentElement != null) {
      if (currentElement.classList.contains("note-stack-group")) {
        targetTop = currentElement.offsetTop;
        targetHeight = currentElement.clientHeight;
      }
      if (currentElement.classList.contains("note-group")) {
        targetCents = parseInt(currentElement.dataset["value"] ?? "0");
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (targetCents !== 0 && targetHeight !== 0) {
      let noteHeight = document.getElementsByClassName("note")[0].clientHeight;
      let newCount = Math.round(
        (targetHeight - (event.center.y - targetTop) - noteHeight * 0.5) /
          (noteHeight * 0.25)
      );
      setNoteCount(targetCents, newCount);
    }
  };
  const handlePress = (event: HammerInput) => {
    if (previousNoteBox) return;
    let currentElement: HTMLElement | null = event.target;
    let targetCents = 0;
    let targetTop = 0;
    let targetHeight = 0;

    while (currentElement != null) {
      if (currentElement.classList.contains("note-stack-group")) {
        targetTop = currentElement.offsetTop;
        targetHeight = currentElement.clientHeight;
      }
      if (currentElement.classList.contains("note-group")) {
        targetCents = parseInt(currentElement.dataset["value"] ?? "0");
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (targetCents !== 0 && targetHeight !== 0) {
      let noteHeight = document.getElementsByClassName("note")[0].clientHeight;
      let newCount = Math.round(
        (targetHeight - (event.center.y - targetTop) - noteHeight * 0.5) /
          (noteHeight * 0.25)
      );
      setNoteCount(targetCents, newCount);

      setSelectedGroup({
        cents: targetCents,
        noteHeight: noteHeight,
        top: targetTop,
        height: targetHeight,
        offset: 0,
      });
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    const target: HTMLDivElement = event.target as HTMLDivElement;
    target.setPointerCapture(event.pointerId);

    if (previousNoteBox) return;
    let currentElement: HTMLElement | null = event.target as HTMLElement;
    let targetCents = 0;
    let targetTop = 0;
    let targetHeight = 0;

    while (currentElement != null) {
      if (currentElement.classList.contains("note-stack-group")) {
        targetTop = currentElement.offsetTop;
        targetHeight = currentElement.clientHeight;
      }
      if (currentElement.classList.contains("note-group")) {
        targetCents = parseInt(currentElement.dataset["value"] ?? "0");
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (targetCents !== 0 && targetHeight !== 0) {
      let noteHeight = document.getElementsByClassName("note")[0].clientHeight;
      let currentCount = getNoteCount(targetCents);
      let newCount = Math.round(
        (targetHeight - (event.clientY - targetTop) - noteHeight * 0.5) /
          (noteHeight * 0.25)
      );

      setSelectedGroup({
        cents: targetCents,
        noteHeight: noteHeight,
        top: targetTop,
        height: targetHeight,
        offset: newCount - currentCount,
      });
    }
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (previousNoteBox) return;

    if (selectedGroup) {
      let newCount =
        Math.round(
          (selectedGroup.height -
            (event.clientY - selectedGroup.top) -
            selectedGroup.noteHeight * 0.5) /
            (selectedGroup.noteHeight * 0.25)
        ) - selectedGroup.offset;

      setNoteCount(selectedGroup.cents, newCount);
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (previousNoteBox) return;

    if (selectedGroup) {
      setSelectedGroup(null);
    }
  };

  return (
    <StyledNoteBox
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div>
        <NoteGroup
          name="100 EURO"
          image={note100}
          centValue={10000}
          count={noteBox.note100}
          previousCount={previousNoteBox?.note100 ?? 0}
        />
      </div>

      <div>
        <NoteGroup
          name="50 EURO"
          image={note50}
          centValue={5000}
          count={noteBox.note50}
          previousCount={previousNoteBox?.note50 ?? 0}
        />
      </div>

      <div>
        <NoteGroup
          name="20 EURO"
          image={note20}
          centValue={2000}
          count={noteBox.note20}
          previousCount={previousNoteBox?.note20 ?? 0}
        />
      </div>

      <div>
        <NoteGroup
          name="10 EURO"
          image={note10}
          centValue={1000}
          count={noteBox.note10}
          previousCount={previousNoteBox?.note10 ?? 0}
        />
      </div>

      <div>
        <NoteGroup
          name="5 EURO"
          image={note5}
          centValue={500}
          count={noteBox.note5}
          previousCount={previousNoteBox?.note5 ?? 0}
        />
      </div>
    </StyledNoteBox>
  );
};
