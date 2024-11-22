import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import PeerComm from "./PeerComm.jsx";
import TestComponents from "./TestComponents";
// import TestGameLogic from "./TestGameLogic";

createRoot(document.getElementById("root")).render(
  // <TestLogic />
  <StrictMode>
    {/* <PeerComm /> */}
    <TestComponents />
    {/* <TestGameLogic /> */}
  </StrictMode>
);
