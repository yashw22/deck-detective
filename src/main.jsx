import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import PeerComm from "./PeerComm.jsx";
import TestLogic from "./TestLogic.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <PeerComm /> */}
    <TestLogic />
  </StrictMode>
);
