import React from 'react';
import './SidebarPage.scss';

export interface SidebarAction {
  element: any;
  title: string;
  action: () => void;
  buttom?: boolean;
}

export interface SidebarProps {
  content?: SidebarAction[];
  defaultAction?: () => void;
  children: any;
}

export default function Sidebar(props: SidebarProps) {
  const elementsTop = props.content
    ?.filter((c) => c.buttom !== true)
    .map((c, i) => (
      <div key={i} title={c.title} onClick={() => c.action()}>
        {c.element}
      </div>
    ));
  const elementsBottom = props.content
    ?.filter((c) => c.buttom === true)
    .map((c, i) => (
      <div key={i} title={c.title} onClick={() => c.action()}>
        {c.element}
      </div>
    ));

  return (
    <div className="sidebar-page">
      <div className="sidebar">
        <div className="sidebar-top">
          <div title="ascii pay" onClick={props.defaultAction}>
            <img src="/favicon.svg" alt="" />
          </div>
          {elementsTop}
        </div>
        <div className="sidebar-bottom">{elementsBottom}</div>
      </div>
      <div className="sidebar-content">{props.children}</div>
    </div>
  );
}