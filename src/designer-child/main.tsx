import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "./style.css";
import App from "./App";
import {IconContext} from "@phosphor-icons/react";
import SmoothSurfaces from "./SmoothSurfaces";
import "./ui-system.css";
import "./ui-controls.css";
import "./ui-neutral.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IconContext.Provider value={{weight:"duotone"}}><App /></IconContext.Provider>
    <SmoothSurfaces/>
  </StrictMode>,
);
