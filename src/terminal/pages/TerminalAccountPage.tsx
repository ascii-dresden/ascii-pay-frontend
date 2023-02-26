import React from "react";
import { useNavigate } from "react-router-dom";
import { SidebarLayout } from "../components/SidebarLayout";

export const TerminalAccountPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => navigate("/terminal");

  return <SidebarLayout defaultAction={handleGoBack}>TODO</SidebarLayout>;
};
