import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import PeerComm from "./PeerComm.jsx";
import TestLobby from "./TestLobby.jsx";
// import Firebase from "./Firebase.jsx";
// import TestComponents from "./TestComponents";
// import TestGameLogic from "./TestGameLogic";

createRoot(document.getElementById("root")).render(
  // <TestComponents />
  <StrictMode>
    {/* <PeerComm /> */}
    <TestLobby />
    {/* <Firebase /> */}
    {/* <TestComponents /> */}
    {/* <TestGameLogic /> */}
  </StrictMode>
);
