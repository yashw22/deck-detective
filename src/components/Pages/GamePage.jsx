import { forwardRef, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";

import styles from "./GamePage.module.css";

import SearchCard from "../Cards/SearchCard";
import ElementCard from "../Cards/ElementCard";

const GamePage = forwardRef(function GamePage(
  { myPeerId, myName, sendBroadcast, sendPrivate, playerList, boardInfo },
  ref
) {
  useEffect(() => {
    // console.log(myPeerId)
    // console.log(myName)
    // console.log(playerList)
    // console.log(boardInfo)
    // console.log(boardInfo[myPeerId]);
  }, []);

  useImperativeHandle(ref, () => ({
    callChildFn: () => {
      console.log("frim child fn");
    },
  }));

  return (
    <div>
      {/* <h1>Deck Detective</h1> */}
      {Object.entries(playerList).map(([playerId, playerObj]) => (
        <div key={playerId}>
          <h2>{playerObj.name}</h2>
          <div className={styles.cardRow}>
            {boardInfo[playerId].searchCards.map((card, idx) => (
              <div key={idx} className={styles.cards}>
                <SearchCard card={card} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <h1>Detective {myName}</h1>
      <div className={styles.cardRow}>
        {boardInfo[myPeerId].searchCards.map((card, idx) => (
          <div key={idx} className={styles.cards}>
            <SearchCard card={card} />
          </div>
        ))}
      </div>
      <br />
      <div className={styles.cardRow}>
        {boardInfo[myPeerId].weaponCards.map((card, idx) => (
          <div key={idx} className={styles.cards}>
            <ElementCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
});

GamePage.propTypes = {
  myPeerId: PropTypes.string.isRequired,
  myName: PropTypes.string.isRequired,
  sendBroadcast: PropTypes.func.isRequired,
  sendPrivate: PropTypes.func.isRequired,
  playerList: PropTypes.object.isRequired,
  boardInfo: PropTypes.object.isRequired,
};

export default GamePage;
