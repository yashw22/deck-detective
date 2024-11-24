import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import PeerComm from "./components/Testing/PeerComm.jsx";
// import TestLobby from "./components/Testing/TestLobby.jsx";
// import Firebase from "./components/Testing/Firebase.jsx";
import TestComponents from "./components/Testing/TestComponents";
// import TestGameLogic from "./components/Testing/TestGameLogic";

createRoot(document.getElementById("root")).render(
  // <TestComponents />
  <StrictMode>
    {/* <PeerComm /> */}
    {/* <TestLobby /> */}
    {/* <Firebase /> */}
    <TestComponents />
    {/* <TestGameLogic /> */}
  </StrictMode>
);
