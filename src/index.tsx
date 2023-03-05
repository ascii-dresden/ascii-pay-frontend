import React from "react";
import { createRoot } from "react-dom/client";
import { DashboardApp } from "./dashboardApp/DashboardApp";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router>
      <DashboardApp />
    </Router>
  </React.StrictMode>
);
