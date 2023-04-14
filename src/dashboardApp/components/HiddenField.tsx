import React from "react";
import styled from "@emotion/styled";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useDashboardSelector } from "../redux/dashboardStore";

const StyledFieldContent = styled.div`
  filter: blur(8px) grayscale(100%);
  opacity: 0.7;
`;

const StyledFieldHidden = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
`;

const StyledField = styled.div`
  user-select: none;
  cursor: pointer;
  position: relative;

  &.visible {
    & > div:first-of-type {
      filter: none;
      opacity: 1;
    }

    & > div:last-of-type {
      display: none;
    }
  }
`;

export const HiddenField = (props: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const revealAllHiddenFields = useDashboardSelector(
    (state) => state.adminState.revealAllHiddenFields
  );
  const [visible, setVisible] = React.useState(false);

  if (!props.children) {
    return <></>;
  }

  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setVisible((v) => !v);
  };

  return (
    <StyledField
      className={clsx({ visible: visible || revealAllHiddenFields })}
      onClick={clickHandler}
    >
      <StyledFieldContent>{props.children}</StyledFieldContent>
      <StyledFieldHidden>{t("layout.hiddenFieldText")}</StyledFieldHidden>
    </StyledField>
  );
};
