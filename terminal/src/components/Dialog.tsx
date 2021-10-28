import * as React from 'react';

import './Dialog.scss';

export interface DialogProps {
  title: string;
  children: any;
  actions: {
    label: string;
    action: () => void;
  }[];
  large?: boolean;
}

export default function Dialog(props: DialogProps) {
  let actions = props.actions.map(({ label, action }) => {
    return (
      <button key={label} className="dialog-action" onClick={() => action()}>
        {label}
      </button>
    );
  });

  return (
    <div className="dialog">
      <div className={'dialog-body' + (props.large ? ' dialog-width' : '')}>
        <div className="dialog-title">{props.title}</div>
        <div className="dialog-content">{props.children}</div>
        <div className="dialog-actions">{actions}</div>
      </div>
    </div>
  );
}
