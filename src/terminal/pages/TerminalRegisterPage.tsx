import React from "react";
import { CoinBox } from "../register/CoinBox";
import { Envelope } from "../register/Envelope";
import { NoteBox } from "../register/NoteBox";
import {
  RegisterMode,
  setRegisterMode,
  toggleResultMode,
} from "../../redux/features/registerSlice";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { SidebarAction, SidebarLayout } from "../components/SidebarLayout";
import { Done, EuroSymbol, LocalAtm, MailOutline } from "@mui/icons-material";

export const TerminalRegisterPage = (props: {
  setAppClass: (appClass: string | null) => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoBack = () => navigate("/terminal");

  const registerMode = useAppSelector(
    (state) => state.registerState.registerMode
  );
  const previous = useAppSelector((state) => state.registerState.previous);
  const dispatch = useAppDispatch();

  let content: any | null = null;
  switch (registerMode) {
    case RegisterMode.COINS:
      content = <CoinBox setAppClass={props.setAppClass} />;
      break;
    case RegisterMode.NOTES:
      content = <NoteBox setAppClass={props.setAppClass} />;
      break;
    case RegisterMode.RESULT:
      content = <Envelope />;
      break;
  }

  const sidebarContent: SidebarAction[] = [
    {
      title: t("register.enterCoins"),
      element: <EuroSymbol />,
      action: () => dispatch(setRegisterMode(RegisterMode.COINS)),
      active: registerMode === RegisterMode.COINS,
    },
    {
      title: t("register.enterNotes"),
      element: <LocalAtm />,
      action: () => dispatch(setRegisterMode(RegisterMode.NOTES)),
      active: registerMode === RegisterMode.NOTES,
    },
    {
      title: t("register.overview"),
      element: <MailOutline />,
      action: () => dispatch(setRegisterMode(RegisterMode.RESULT)),
      active: registerMode === RegisterMode.RESULT,
    },
    {
      title: t("register.calculate"),
      element: <Done />,
      action: () => dispatch(toggleResultMode()),
      active: !!previous,
      bottom: true,
    },
  ];

  return (
    <SidebarLayout defaultAction={handleGoBack} content={sidebarContent}>
      {content}
    </SidebarLayout>
  );
};
