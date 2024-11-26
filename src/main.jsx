import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Lobby from "./components/Testing/LobbyTesting";
// import Firebase from "./components/Testing/Firebase.jsx";
// import TestComponents from "./components/Testing/TestComponents";
// import TestGameLogic from "./components/Testing/TestGameLogic";

createRoot(document.getElementById("root")).render(
  // <TestComponents />
  <StrictMode>
    <Lobby />
    {/* <Firebase /> */}
    {/* <TestComponents /> */}
    {/* <TestGameLogic /> */}
  </StrictMode>
);
