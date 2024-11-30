import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./HowToPlayPage.module.css";

export default function HowToPlayPage({ onBack }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>How to Play: Deck Detective</h1>
      <button className={styles.backButton} onClick={() => onBack()}>
        ← Back
      </button>

      <section className={styles.section}>
        <h2 onClick={() => toggleSection("objective")} className={styles.title}>
          {openSections.objective ? "▼" : "►"} Objective
        </h2>
        {openSections.objective && (
          <p>
            The objective of the game is to determine the exact identity of the
            hidden card before your opponents by collecting clues, asking
            questions, and analyzing the responses.
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h2 onClick={() => toggleSection("setup")} className={styles.title}>
          {openSections.setup ? "▼" : "►"} Setup
        </h2>
        {openSections.setup && (
          <>
            <h3>1. Players</h3>
            <p>3 to 5 players.</p>
            <h3>2. Element Deck Setup</h3>
            <ul className={styles.ul}>
              <li>Shuffle the deck of element cards (36 cards).</li>
              <li>
                Remove one card from the element deck and place it face down as
                the <strong>hidden card</strong>.
              </li>
              <li>Distribute the remaining cards evenly among the players.</li>
            </ul>
            <h3>3. Search Deck Setup</h3>
            <ul className={styles.ul}>
              <li>Shuffle the deck of search cards (54 cards).</li>
              <li>
                Distribute 4 cards each to players and place them face up.
              </li>
              <li>
                Remaining search cards stay in a pile on the board face down.
              </li>
            </ul>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2 onClick={() => toggleSection("gameplay")} className={styles.title}>
          {openSections.gameplay ? "▼" : "►"} Gameplay
        </h2>
        {openSections.gameplay && (
          <>
            <h3>Starting the Game</h3>
            <ul className={styles.ul}>
              <li>Decide the first player randomly.</li>
              <li>Play proceeds clockwise.</li>
            </ul>
            <h3>On Your Turn</h3>
            <ul className={styles.ul}>
              <li>
                Ask another player a question using any one of the 4 search
                cards on the board.
              </li>
              <li>
                The player responds truthfully but does <strong>not</strong>{" "}
                reveal their card publicly. Depending on the search card:
                <ul className={styles.ul}>
                  <li>
                    If it has 1 element, the player announces the count matching
                    the question to everyone.
                  </li>
                  <li>
                    If it has 2 elements, the responding player shows the
                    matching card privately to the asker and announces the count
                    to everyone.
                  </li>
                </ul>
              </li>
              <li>
                Discard the used search card face up and replace it with a new
                one from the pile.
              </li>
            </ul>
            <h3>Note Taking</h3>
            <p>
              Players are encouraged to keep notes privately to track questions
              and responses.
            </p>
          </>
        )}
      </section>

      <section className={styles.section}>
        <h2 onClick={() => toggleSection("special")} className={styles.title}>
          {openSections.specialRules ? "▼" : "►"} Special Rules
        </h2>
        {openSections.special && (
          <ul className={styles.ul}>
            <li>
              <strong>No Repeated Questions:</strong> You cannot ask the same
              question twice in consecutive turns to the same player.
            </li>
            <li>
              <strong>Bluffing is Not Allowed:</strong> Players must always
              answer truthfully.
            </li>
            <li>
              <strong>Free Choice on ❓:</strong> Use the wildcard to replace it
              with any valid element.
            </li>
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 onClick={() => toggleSection("winning")} className={styles.title}>
          {openSections.winning ? "▼" : "►"} Winning the Game
        </h2>
        {openSections.winning && (
          <ul className={styles.ul}>
            <li>
              <strong>Guess the Hidden Card:</strong> Declare your guess on your
              turn. If correct, you win. If incorrect, you are eliminated.
            </li>
            <li>
              <strong>End of the Game:</strong> The game ends when someone
              guesses the card correctly or all but one player is eliminated.
            </li>
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 onClick={() => toggleSection("tips")} className={styles.title}>
          {openSections.tips ? "▼" : "►"} Tips for Players
        </h2>
        {openSections.tips && (
          <ul className={styles.ul}>
            <li>Ask strategic questions to eliminate possibilities.</li>
            <li>Track responses carefully and cross-reference them.</li>
            <li>
              Be mindful of the information you reveal with your questions.
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}
HowToPlayPage.propTypes = {
  onBack: PropTypes.func.isRequired,
};
