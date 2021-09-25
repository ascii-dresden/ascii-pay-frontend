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
export interface DialogState {}

export class Dialog extends React.Component<DialogProps, DialogState> {
  static displayName = 'Dialog';

  constructor(props: DialogProps) {
    super(props);

    this.state = {};
  }

  render() {
    let actions = this.props.actions.map(({ label, action }) => {
      return (
        <div key={label} className="dialog-action" onClick={() => action()}>
          {label}
        </div>
      );
    });
    return (
      <div className="dialog">
        <div className={'dialog-body' + (this.props.large ? ' dialog-width' : '')}>
          <div className="dialog-title">{this.props.title}</div>
          <div className="dialog-content">{this.props.children}</div>
          <div className="dialog-actions">{actions}</div>
        </div>
      </div>
    );
  }
}
