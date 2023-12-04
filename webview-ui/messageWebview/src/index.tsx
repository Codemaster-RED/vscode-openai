import {
  webDarkTheme,
  webLightTheme,
  FluentProvider,
  tokens,
} from "@fluentui/react-components";
import React, { CSSProperties } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root") as HTMLElement;
const theme =
  rootElement.getAttribute("theme") === "dark" ? webDarkTheme : webLightTheme;
const root = ReactDOM.createRoot(rootElement);

const re = document.getElementById("root") as HTMLElement;
const backgroundImage =
  re.getAttribute("backgroundImage") ?? tokens.colorNeutralBackground4;

const styleCode: CSSProperties = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "contain",
  backgroundRepeat: "repeat-y",
  minHeight: "100vh",
};
root.render(
  <React.StrictMode>
    <FluentProvider theme={theme} style={styleCode}>
      <App />
    </FluentProvider>
  </React.StrictMode>
);
