import React from "react";
import { CoinBox } from "../register/CoinBox";
import { Envelope } from "../register/Envelope";
import { NoteBox } from "../register/NoteBox";
import {
  RegisterMode,
  resetRegisterState,
  setRegisterMode,
} from "../redux/features/registerSlice";
import { useTranslation } from "react-i18next";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import { SidebarAction, SidebarLayout } from "../components/SidebarLayout";
import {
  DeleteForeverOutlined,
  EuroSymbol,
  LocalAtm,
  MailOutline,
  MarkEmailReadOutlined,
  Rule,
} from "@mui/icons-material";
import { TerminalNavigateHandler } from "../TerminalApp";
import { Checklist, ChecklistProgress } from "../register/Checklist";

export const TerminalRegisterPage = (props: {
  setAppClass: (appClass: string | null) => void;
  navigate: TerminalNavigateHandler;
}) => {
  const { t } = useTranslation();
  const handleGoBack = () => props.navigate("start");

  const registerMode = useTerminalSelector(
    (state) => state.registerState.registerMode
  );
  const previous = useTerminalSelector((state) => state.registerState.previous);
  const dispatch = useTerminalDispatch();

  let content: any | null = null;
  switch (registerMode) {
    case RegisterMode.CHECKLIST:
      content = <Checklist />;
      break;
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
      title: t("register.checklist"),
      element: <Rule />,
      action: () => dispatch(setRegisterMode(RegisterMode.CHECKLIST)),
      active: registerMode === RegisterMode.CHECKLIST,
    },
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
      element: previous ? <MarkEmailReadOutlined /> : <MailOutline />,
      action: () => dispatch(setRegisterMode(RegisterMode.RESULT)),
      active: registerMode === RegisterMode.RESULT,
    },
    {
      title: t("register.reset"),
      element: <DeleteForeverOutlined />,
      action: () => dispatch(resetRegisterState()),
      bottom: true,
    },
  ];

  return (
    <SidebarLayout defaultAction={handleGoBack} content={sidebarContent}>
      <ChecklistProgress />
      {content}
    </SidebarLayout>
  );
};
