import { useState } from "react";
import CreateGame from "./CreateGameTesting";
import JoinGame from "./JoinGameTesting";
import "./chatboxTesting.css";

export default function Lobby() {
  const [inputText, setInputText] = useState("");
  const [myName, setMyName] = useState();
  const [activeComponent, setActiveComponent] = useState();

  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  if (!myName)
    return (
      <div className="app">
        Choose your name
        <br />
        <input
          type="text"
          placeholder="Enter your name"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <br />
        <button onClick={() => setMyName(inputText)}>Continue</button>
      </div>
    );

  if (!activeComponent)
    return (
      <div className="app">
        Hi {myName}
        <br />
        <button onClick={() => handleButtonClick("create")}>Create Room</button>
        <br />
        <button onClick={() => handleButtonClick("join")}>Join Room</button>
      </div>
    );

  return (
    <div className="app">
      {activeComponent === "create" && <CreateGame myName={myName} />}
      {activeComponent === "join" && <JoinGame myName={myName} />}
    </div>
  );
}
