import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StartingPage from "./components/Pages/StartingPage";

// import Firebase from "./components/Testing/Firebase.jsx";
// import TestComponents from "./components/Testing/TestComponents";
// import TestGameLogic from "./components/Testing/TestGameLogic";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StartingPage />
    {/* <Firebase /> */}
    {/* <TestComponents /> */}
    {/* <TestGameLogic /> */}
  </StrictMode>
);
