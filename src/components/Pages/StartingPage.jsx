import { useState } from "react";
import LobbyCreatePage from "./LobbyCreatePage";
import LobbyJoinPage from "./LobbyJoinPage";

import styles from "./StartingPage.module.css";
import HowToPlay from "./HowToPlayPage";

export default function StartingPage() {
  const [name, setName] = useState(""); // Store the detective's name
  const [isRulePage, setIsRulePage] = useState(false); // Toggle Rule page
  const [isNamePage, setIsNamePage] = useState(true); // Toggle lobby page
  const [activeComponent, setActiveComponent] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) setIsNamePage(false); // Move to the second page
  };

  const handleLobbyOptionClick = (component) => {
    setActiveComponent(component);
  };

  const onRuleBack = () => {
    setIsRulePage(false);
  };

  if (isRulePage) return <HowToPlay onBack={onRuleBack} />;

  /* First Page: Enter Name */
  if (isNamePage)
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
          <button onClick={() => setIsRulePage(true)} className={styles.button}>
            How to Play
          </button>
        </div>
      </div>
    );

  /* Second Page: Game Options */
  if (!activeComponent)
    return (
      <div className={styles.body}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            Detective <span className={styles.playerName}>{name}</span>
          </h1>
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
