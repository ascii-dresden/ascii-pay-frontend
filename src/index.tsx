import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { GlobalStyle } from "./globalStyle";
import { AuthMiddleware } from "./Helpers/AuthMiddleware";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Global } from "@emotion/react";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <CookiesProvider>
          <AuthMiddleware>
            <Global styles={GlobalStyle} />
            <App />
          </AuthMiddleware>
        </CookiesProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);
