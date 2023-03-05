import React from "react";
import styled from "@emotion/styled";
import clsx from "clsx";
import logo from "../../assets/ascii-circle-icon.svg";
import { useTheme } from "@mui/material";

const StyledSidebarPage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const StyledSidebar = styled.div`
  position: absolute;
  left: 0;
  width: 4em;
  top: 0;
  height: 100%;
  background-color: var(--primary-background);
  border-right: solid 1px var(--border-color);

  & > div > div {
    width: 4em;
    height: 3.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-right: solid 1px var(--border-color);

    svg,
    img {
      width: 1.8em;
      height: 1.8em;
    }

    #sidebar-ascii-logo {
      width: 2.4em !important;
      height: 2.4em !important;
    }

    &:hover {
      background-color: var(--primary-hover-background);
    }

    &.active {
      color: var(--theme-color);
      background-color: var(--active-tab-background);
      border-top: solid 1px var(--border-color);
      border-bottom: solid 1px var(--border-color);
      border-right-color: transparent;
    }
  }
`;

const StyledSidebarTop = styled.div`
  position: absolute;
  top: 0;

  &.dark img {
    filter: invert(1);
  }

  & > div:first-of-type {
    height: 4.4em;

    img {
      width: 2em;
      height: 2em;
    }
  }
`;

const StyledSidebarBottom = styled.div`
  position: absolute;
  bottom: 0;

  & > div:last-child.active {
    border-bottom-color: transparent;
  }
`;

const StyledSidebarContent = styled.div`
  position: absolute;
  left: 4em;
  right: 0;
  top: 0;
  height: 100%;
`;

export type SidebarAction = {
  element: any;
  title: string;
  action: (event: React.MouseEvent) => void;
  bottom?: boolean;
  active?: boolean;
};

export const SidebarLayout = (props: {
  content?: SidebarAction[];
  defaultAction?: () => void;
  children?: any;
}) => {
  const theme = useTheme();

  const elementsTop = props.content
    ?.filter((c) => c.bottom !== true)
    .map((c, i) => (
      <div
        key={i}
        title={c.title}
        onClick={(e) => c.action(e)}
        className={clsx({ active: c.active })}
      >
        {c.element}
      </div>
    ));
  const elementsBottom = props.content
    ?.filter((c) => c.bottom === true)
    .map((c, i) => (
      <div
        key={i}
        title={c.title}
        onClick={(e) => c.action(e)}
        className={clsx({ active: c.active })}
      >
        {c.element}
      </div>
    ));

  return (
    <StyledSidebarPage>
      <StyledSidebar>
        <StyledSidebarTop
          className={clsx({ dark: theme.palette.mode === "dark" })}
        >
          <div title="ascii pay" onClick={props.defaultAction}>
            <img id="sidebar-ascii-logo" src={logo} alt="" />
          </div>
          {elementsTop}
        </StyledSidebarTop>
        <StyledSidebarBottom>{elementsBottom}</StyledSidebarBottom>
      </StyledSidebar>
      <StyledSidebarContent>{props.children}</StyledSidebarContent>
    </StyledSidebarPage>
  );
};
