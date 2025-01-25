import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./HowToPlayPage.module.css";

import ElementCard from "../Cards/ElementCard";
import {
  COLORS,
  COUNTS,
  ELEMENTS_TYPE,
  FREE_ICON,
  WEAPONS,
} from "../../config/constants";
import { getString } from "../../utils/helpers";
import SearchCard from "../Cards/SearchCard";

export default function HowToPlayPage({ onBack }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const createSampleElementCard = () => {
    const cards = [
      { weapon: WEAPONS[0], count: COUNTS[0], color: COLORS[0] },
      { weapon: WEAPONS[1], count: COUNTS[0], color: COLORS[0] },
      { weapon: WEAPONS[1], count: COUNTS[1], color: COLORS[1] },
      { weapon: WEAPONS[2], count: COUNTS[2], color: COLORS[2] },
    ];
    return (
      <div className={styles.cardRow}>
        {cards.map((card, idx) => (
          <div key={idx} className={styles.card}>
            <ElementCard card={card} />
            <ul>
              {Object.entries(card).map(([key, value]) => (
                <li key={key + value} style={{ margin: 0 }}>
                  {key + ": " + getString(value)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const createSampleSearchCard = () => {
    const cards = [
      { elementsCount: 2, weapon: WEAPONS[1], count: COUNTS[1] },
      { elementsCount: 2, count: COUNTS[2], color: COLORS[0] },
      { elementsCount: 2, count: COUNTS[2], free: true },
      { elementsCount: 1, free: true },
      { elementsCount: 2, weapon: WEAPONS[2], color: COLORS[2] },
    ];
    return (
      <div className={styles.cardRow}>
        {cards.map((card, idx) => (
          <div key={idx} className={styles.card}>
            <SearchCard card={card} />
            <ul>
              {Object.entries(card).map(([key, value]) => {
                if (ELEMENTS_TYPE.includes(key)) {
                  return (
                    <li key={key + value}>{key + ": " + getString(value)}</li>
                  );
                } else if (key === "free") {
                  return <li key={key + value}>free choice ({FREE_ICON})</li>;
                }
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.header}>How to Play: Deck Detective</h1>
        <button className={styles.backButton} onClick={() => onBack()}>
          ← Back
        </button>

        <section className={styles.section}>
          <h2
            onClick={() => toggleSection("cardType")}
            className={styles.title}
          >
            {openSections.cardType ? "▼" : "►"} Type of Cards
          </h2>
          {openSections.cardType && (
            <div>
              <h3>
                <u>Element Card (36 cards)</u>
              </h3>
              <ul className={styles.ul}>
                <li>
                  Each element card has following:
                  <ol>
                    <li>
                      weapon:{" "}
                      {WEAPONS.map((weapon) => weapon + getString(weapon)).join(
                        ", "
                      )}
                    </li>
                    <li>
                      count:{" "}
                      {COUNTS.map((count) => getString(count)).join(", ")}
                    </li>
                    <li>
                      color:{" "}
                      {COLORS.map((color) => getString(color)).join(", ")}
                    </li>
                  </ol>
                </li>
                <li>For example:</li>
              </ul>
              <div>{createSampleElementCard()}</div>

              <h3>
                <u>Search Card (54 cards)</u>
              </h3>
              <ul className={styles.ul}>
                <li>
                  Search Cards are used to ask other players questions about
                  their cards.
                </li>
                <li>Each card can have up to 2 properties.</li>
                <li>
                  Some cards have a Free Choice property, allowing you to ask
                  about any property of your choice.
                </li>
                <li>For example:</li>
              </ul>
              <div>{createSampleSearchCard()}</div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 onClick={() => toggleSection("goal")} className={styles.title}>
            {openSections.goal ? "▼" : "►"} Goal
          </h2>
          {openSections.goal && (
            <div>
              The goal of the game is to find the hidden card before your
              opponents. You can do this by:
              <ul>
                <li>Collecting clues from other players using search cards.</li>
                <li>Analyzing their responses to narrow down possibilities.</li>
              </ul>
            </div>
          )}
        </section>

        {/* <section className={styles.section}>
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
                  Remove one card from the element deck and place it face down
                  as the <strong>hidden card</strong>.
                </li>
                <li>
                  Distribute the remaining cards evenly among the players.
                </li>
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
        </section> */}

        <section className={styles.section}>
          <h2
            onClick={() => toggleSection("gameplay")}
            className={styles.title}
          >
            {openSections.gameplay ? "▼" : "►"} Gameplay
          </h2>
          {openSections.gameplay && (
            <>
              <h3>Starting the Game</h3>
              <ul className={styles.ul}>
                <li>
                  <b>Hidden Card:</b> One Element Card is hidden.
                </li>
                <li>
                  <b>Distributing Element Cards:</b>
                  <ul>
                    <li>
                      The remaining Element Cards are dealt equally to all
                      players. (&apos;Element Cards&apos; tab)
                    </li>
                    <li>
                      Any leftover cards go into the common card pile.
                      (&apos;Common Cards&apos; tab)
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Search Cards:</b> Each player gets 4 Search Cards to start.
                  (&apos;Search Cards&apos; tab)
                </li>
                <li>
                  <b>Note Taking:</b> Note down the Element Cards in your hand
                  on the Investigation Sheet before starting.
                </li>

                <li>Game proceeds turn by turn.</li>
              </ul>
              <h3>On Your Turn</h3>
              <ul className={styles.ul}>
                <li>
                  <b>Ask a Question:</b> Use one of your 4 Search Cards to ask
                  another player about their Element Cards.
                </li>
                <li>
                  <b>Player&apos;s Response:</b> You get information about that
                  player&apos;s card. You can note this down on the
                  investigation sheet.
                </li>
                <li>
                  <b>Replace used Search Card:</b> New search card replaces used
                  search card.
                </li>
                <li>
                  <b>Type of response based on search card:</b>

                  <ul className={styles.ul}>
                    <li>
                      <b>1 property in search card: </b>Everyone gets the count
                      of matching element cards.
                    </li>
                    <img src="/deck-detective/1prop.png" />

                    <li>
                      <b>2 properties in search card: </b>
                      <ul>
                        <li>You privately see matching element cards.</li>
                        <li>
                          Everyone gets the count of matching element cards.
                        </li>
                      </ul>
                      <img src="/deck-detective/2prop.png" />
                    </li>
                  </ul>
                </li>
              </ul>
            </>
          )}
        </section>

        {/* <section className={styles.section}>
          <h2 onClick={() => toggleSection("special")} className={styles.title}>
            {openSections.special ? "▼" : "►"} Special Rules
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
                <strong>Free Choice on ❓:</strong> Use the wildcard to replace
                it with any valid element.
              </li>
            </ul>
          )}
        </section> */}

        <section className={styles.section}>
          <h2
            onClick={() => toggleSection("guessing")}
            className={styles.title}
          >
            {openSections.guessing ? "▼" : "►"} Making a Guess
          </h2>
          {openSections.guessing && (
            <ul className={styles.ul}>
              <li>
                <b>Guess the Hidden Card:</b> In your turn, choose the element
                card (weapon, count and color) you think is the hidden card.
                <img src="/deck-detective/guess.png" />
              </li>
              <li>
                If guess is correct, you win. If incorrect, you are eliminated
                and game continues.
              </li>
              <li>
                <strong>Game ends:</strong> when someone guesses the card
                correctly or ony one player remains.
              </li>
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2
            onClick={() => toggleSection("investigationSheet")}
            className={styles.title}
          >
            {openSections.investigationSheet ? "▼" : "►"} Note Taking /
            Investigation Sheet
          </h2>
          {openSections.investigationSheet && (
            <ul className={styles.ul}>
              <li>
                Use the Investigation Sheet to track which element cards each
                player has.
              </li>
              <li>
                The sheet has 36 boxes representing all possible element cards
                (combination of weapon, color, and count).
              </li>
              <li>
                Each box has a top and bottom section. Use them to mark whether
                a player has or does not have that card.
              </li>
              <li>
                Select a box and click on the buttons below the sheet to mark
                them accordingly
                <ul>
                  <li>
                    Click on a player&apos;s name to mark a box for that
                    player&apos;s card.
                  </li>
                  <li>
                    Click on X next to a player&apos;s name to indicate that the
                    card belongs to that player. (Tracks the count of cards you
                    know that player has)
                  </li>
                  <li>
                    Click on Common to mark the card as part of the common pile
                    (cards not held by players).
                  </li>
                  <li>Click Clear to reset information for a selected box.</li>
                  <li>Click RESET to clear the entire Investigation Sheet.</li>
                </ul>
              </li>
              <li>
                You can take additional notes in the &apos;Notes&apos; tab.
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
              <li>Ask smart questions to eliminate possibilities.</li>
              <li>
                Take notes carefully and cross-reference with other player
                responses.
              </li>
              <li>
                You can always view what search cards other players have in the
                &apos;Others&apos; tab.
              </li>
              <li>
                You can note down additional information in the
                &apos;Others&apos; tab.
              </li>
              <li>
                Choose your questions carefully to avoid giving away too much
                about your element cards. Every question gives your opponents
                information too!
              </li>
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
HowToPlayPage.propTypes = {
  onBack: PropTypes.func.isRequired,
};
