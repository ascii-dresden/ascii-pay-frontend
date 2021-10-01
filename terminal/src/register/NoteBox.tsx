import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setNote10, setNote100, setNote20, setNote5, setNote50 } from './registerSlice';
import './NoteBox.scss';
import Money, { moneyToString } from '../components/Money';
import Hammer from 'react-hammerjs';

function NoteGroup(props: { name: string; image: string; centValue: number; count: number; previousCount: number }) {
  const stacks = Array.from({ length: Math.max(1, Math.max(props.count, props.previousCount)) }, (_, noteIndex) => {
    let classList = 'note';
    if (noteIndex >= props.count) {
      classList += ' previous';

      if (noteIndex >= props.previousCount) {
        classList += ' empty';
      }
    }

    let rotation = ((props.centValue + noteIndex * 3) % 7) - 3;
    return (
      <img
        src={props.image}
        alt={moneyToString(props.centValue)}
        key={noteIndex}
        className={classList}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    );
  });

  return (
    <div className={'note-group note-group-' + props.centValue} data-value={props.centValue}>
      <span>{props.name}</span>
      <div className="note-stack-group">{stacks}</div>
      <div className="note-group-sum">
        <span>{props.count}</span>
        <Money value={props.count * props.centValue} />
      </div>
    </div>
  );
}

export default function NoteBox() {
  const noteBox = useAppSelector((state) => state.register.noteBox);
  const previousNoteBox = useAppSelector((state) => state.register.previous?.noteBox);
  const dispatch = useAppDispatch();

  const [selectedGroup, setSelectedGroup] = useState(null as number | null);
  const [currentDiff, setCurrentDiff] = useState(0);

  const handlePanStart = (event: HammerInput) => {
    if (previousNoteBox) return;
    let currentElement: HTMLElement | null = event.target;
    let targetCents = 0;

    while (currentElement != null) {
      if (currentElement.classList.contains('note-group')) {
        targetCents = parseInt(currentElement.dataset['value'] ?? '0');
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (targetCents !== 0) {
      setSelectedGroup(targetCents);
    }
  };
  const handlePan = (event: HammerInput) => {
    if (previousNoteBox) return;
    let diff = currentDiff - event.velocityY / 2;
    setCurrentDiff(diff);

    let intDiff = 0;
    if (diff >= 1) {
      intDiff = Math.floor(diff);
    } else if (diff <= -1) {
      intDiff = Math.ceil(diff);
    }
    setCurrentDiff(diff - intDiff);

    switch (selectedGroup) {
      case 10000:
        dispatch(setNote100(noteBox.note100 + intDiff));
        break;
      case 5000:
        dispatch(setNote50(noteBox.note50 + intDiff));
        break;
      case 2000:
        dispatch(setNote20(noteBox.note20 + intDiff));
        break;
      case 1000:
        dispatch(setNote10(noteBox.note10 + intDiff));
        break;
      case 500:
        dispatch(setNote5(noteBox.note5 + intDiff));
        break;
    }
  };

  return (
    <Hammer direction={'DIRECTION_ALL'} onPanStart={handlePanStart} onPan={handlePan}>
      <div className="note-box">
        <div>
          <NoteGroup
            name="100 EURO"
            image="/register/note100.png"
            centValue={10000}
            count={noteBox.note100}
            previousCount={previousNoteBox?.note100 ?? 0}
          />
        </div>

        <div>
          <NoteGroup
            name="50 EURO"
            image="/register/note50.png"
            centValue={5000}
            count={noteBox.note50}
            previousCount={previousNoteBox?.note50 ?? 0}
          />
        </div>

        <div>
          <NoteGroup
            name="20 EURO"
            image="/register/note20.png"
            centValue={2000}
            count={noteBox.note20}
            previousCount={previousNoteBox?.note20 ?? 0}
          />
        </div>

        <div>
          <NoteGroup
            name="10 EURO"
            image="/register/note10.png"
            centValue={1000}
            count={noteBox.note10}
            previousCount={previousNoteBox?.note10 ?? 0}
          />
        </div>

        <div>
          <NoteGroup
            name="5 EURO"
            image="/register/note5.png"
            centValue={500}
            count={noteBox.note5}
            previousCount={previousNoteBox?.note5 ?? 0}
          />
        </div>
      </div>
    </Hammer>
  );
}
