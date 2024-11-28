import { useState } from "react";
import LobbyCreatePage from "./LobbyCreatePage";
import LobbyJoinPage from "./LobbyJoinPage";

import styles from "./StartingPage.module.css";

export default function StartingPage() {
  const [name, setName] = useState(""); // Store the detective's name
  const [isLobby, setIsLobby] = useState(false); // Toggle between pages
  const [activeComponent, setActiveComponent] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) setIsLobby(true); // Move to the second page
  };

  const handleLobbyOptionClick = (component) => {
    setActiveComponent(component);
  };

  /* First Page: Enter Name */
  if (!isLobby)
    return (
      <div className={styles.body}>
        <div className={styles.card}>
          <h1 className={styles.title}>Deck Detective</h1>
          <input
            type="text"
            placeholder="Enter Your Detective Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
          <button onClick={handleSubmit} className={styles.button}>
            Begin Investigation
          </button>
        </div>
      </div>
    );

  /* Second Page: Game Options */
  if (!activeComponent)
    return (
      <div className={styles.body}>
        <div className={styles.card}>
          <h1 className={styles.title}>Detective {name}</h1>
          <p>What would you like to do?</p>
          <button
            className={styles.optionButton}
            onClick={() => handleLobbyOptionClick("create")}
          >
            Create Game
          </button>
          <button
            className={styles.optionButton}
            onClick={() => handleLobbyOptionClick("join")}
          >
            Join Game
          </button>
        </div>
      </div>
    );

  /* Third Page: Lobby */
  return (
    <>
      {activeComponent === "create" && <LobbyCreatePage myName={name} />}
      {activeComponent === "join" && <LobbyJoinPage myName={name} />}
    </>
  );
}
