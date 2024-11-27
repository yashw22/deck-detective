import { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

import styles from "./GamePage.module.css";

import SearchCard from "../Cards/SearchCard";
import ElementCard from "../Cards/ElementCard";
import {
  colorElements,
  typeElements,
  weaponElements,
} from "../../lib/gameConstants";
import { getColorHex, getWeaponIcon, lightenColor } from "../../lib/utils";
import { getMatchedCards, pickNextSearchCard } from "../../lib/gameUtils";

const GamePage = forwardRef(function GamePage(
  { myPeerId, myName, sendBroadcast, playerList, boardInfo },
  ref
) {
  const [myBoardInfo, setMyBoardInfo] = useState(boardInfo);

  const [showSearchCardModal, setShowSearchCardModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseData, setResponseData] = useState(false);

  const [showPlayerSelect, setShowPlayerSelect] = useState();
  const [selectedCard, setSelectedCard] = useState();
  const [selectedCardIdx, setSelectedCardIdx] = useState();
  const [singleFree, setSingleFree] = useState(false);
  const [elementsChosen, setElementsChosen] = useState({});

  // useEffect(() => {
  //   console.log(myPeerId)
  //   console.log(myName)
  //   console.log(playerList)
  //   console.log(myBoardInfo)
  //   console.log(myBoardInfo[myPeerId]);
  // }, []);

  useImperativeHandle(ref, () => ({
    setResponse: (data) => {
      // console.log("got response", data);
      if (data.info === "responseSearchCard") {
        setResponseData(data);
        console.log(myBoardInfo)
        console.log(data.boardInfo)
        // boardInfo = { ...data.boardInfo };
        setMyBoardInfo(data.boardInfo);
        // setShowResponseModal(true)
      }

      setShowResponseModal(true);
    },
  }));

  const handleSearchCardClick = (card, cardIdx) => {
    setSelectedCard(card);
    setSelectedCardIdx(cardIdx);

    if ("free" in card) {
      setShowPlayerSelect(false);
      if (card.elementsCount === 1) setSingleFree(true);
      else setSingleFree(false);
    } else setShowPlayerSelect(true);

    setShowSearchCardModal(true);
  };

  const handleModalElementBtn = (key, value) => {
    if (singleFree) {
      setSingleFree(false);
      setElementsChosen({ [key]: value });
    } else {
      setElementsChosen((e) => ({ ...e, [key]: value }));
      setShowPlayerSelect(true);
    }
  };

  const handlePlayerClick = (playerId) => {
    // console.log(playerId, { ...selectedCard, ...elementsChosen });
    // console.log(myBoardInfo);

    const [nextSearchCard, newSearchDeck, newUsedDeck] = pickNextSearchCard(
      myBoardInfo.searchDeck,
      myBoardInfo.usedDeck
    );

    newUsedDeck.push(selectedCard);
    myBoardInfo[myPeerId].searchCards[selectedCardIdx] = nextSearchCard;
    myBoardInfo.searchDeck = newSearchDeck
    myBoardInfo.usedDeck = newUsedDeck
    // myBoardInfo = {
    //   ...myBoardInfo,
    //   searchDeck: newSearchDeck,
    //   usedDeck: newUsedDeck,
    // };
    setMyBoardInfo(myBoardInfo);

    // console.log(myBoardInfo);

    const res = getMatchedCards(
      { ...selectedCard, ...elementsChosen },
      myBoardInfo[playerId].weaponCards
    );

    sendBroadcast({
      info: "responseSearchCard",
      searchCard: selectedCard,
      freeChoice: elementsChosen,
      from: myName,
      to: myBoardInfo[playerId].name,
      res: res.length,
      boardInfo: myBoardInfo,
    });

    setElementsChosen({});
    setShowSearchCardModal(false);

    setResponseData({
      info: "selfSearchCard",
      searchCard: selectedCard,
      freeChoice: elementsChosen,
      from: myName,
      to: myBoardInfo[playerId].name,
      res: res,
      boardInfo: myBoardInfo,
    });
    setShowResponseModal(true);
  };

  const playerSelectContent = () => (
    <>
      <h2>Select a Player</h2>
      <div className={styles.modalBtnRow}>
        {Object.entries(playerList).map(([playerId, playerObj]) => (
          <div
            key={playerId}
            className={styles.modalBtn}
            onClick={() => handlePlayerClick(playerId)}
          >
            {playerObj.name}
          </div>
        ))}
      </div>
    </>
  );

  const freeChoiceSelectContent = () => (
    <>
      <h2>Choose element(s)</h2>
      {!("weapon" in selectedCard) && (
        <div className={styles.modalBtnRow}>
          {weaponElements.map((weapon) => (
            <div
              className={styles.modalBtn}
              key={weapon}
              onClick={() => handleModalElementBtn("weapon", weapon)}
              style={{
                backgroundColor:
                  "weapon" in elementsChosen && elementsChosen.weapon == weapon
                    ? "hsl(0, 0%, 60%)"
                    : "hsl(0, 0%, 80%)",
              }}
            >
              ({getWeaponIcon(weapon)})
            </div>
          ))}
        </div>
      )}
      {!("type" in selectedCard) && (
        <div className={styles.modalBtnRow}>
          {typeElements.map((type) => (
            <div
              className={styles.modalBtn}
              key={type}
              onClick={() => handleModalElementBtn("type", type)}
              style={{
                backgroundColor:
                  "type" in elementsChosen && elementsChosen.type == type
                    ? "hsl(0, 0%, 60%)"
                    : "hsl(0, 0%, 80%)",
              }}
            >
              {type}
            </div>
          ))}
        </div>
      )}
      {!("color" in selectedCard) && (
        <div className={styles.modalBtnRow}>
          {colorElements.map((color) => (
            <div
              className={styles.modalBtn}
              key={color}
              onClick={() => handleModalElementBtn("color", color)}
              style={{
                backgroundColor:
                  "color" in elementsChosen && elementsChosen.color == color
                    ? lightenColor(color)
                    : getColorHex(color),
              }}
            >
              &nbsp;
            </div>
          ))}
        </div>
      )}

      {/* <div
        onClick={() => setShowPlayerSelect(true)}
        className={styles.modalEndBtn}
      >
        Submit
      </div> */}
    </>
  );

  const responseModalContent = () => {
    if (responseData.info === "selfSearchCard") {
      return (
        <>
          <h2>
            {responseData.from} asked {responseData.to}
          </h2>
          <div className={styles.cards}>
            <SearchCard card={responseData.searchCard} />
          </div>
          {Object.keys(responseData.freeChoice).length !== 0 && (
            <div>
              <span>with: &nbsp; &nbsp;</span>
              {Object.entries(responseData.freeChoice).map(
                ([element, value]) => (
                  <span key={element}>
                    {element}: {value} &nbsp;&nbsp;
                  </span>
                )
              )}
            </div>
          )}
          <div className={styles.cardRow}>
            {responseData.res.map((card, idx) => (
              <div key={idx} className={styles.cards}>
                <ElementCard card={card} />
              </div>
            ))}
          </div>
        </>
      );
    } else if (responseData.info === "responseSearchCard") {
      return (
        <>
          <h2>
            {responseData.from} asked {responseData.to}
          </h2>
          <div className={styles.cards}>
            <SearchCard card={responseData.searchCard} />
          </div>
          {Object.keys(responseData.freeChoice).length !== 0 && (
            <div>
              <p>with:</p>
              {Object.entries(responseData.freeChoice).map(
                ([element, value]) => (
                  <p key={element}>
                    {element} = {value}
                  </p>
                )
              )}
            </div>
          )}
          <div>Count: {responseData.res}</div>
        </>
      );
    }
  };

  return (
    <div>
      {/* SearchCard Modal */}
      {showSearchCardModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {showPlayerSelect
              ? playerSelectContent()
              : freeChoiceSelectContent()}
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowResponseModal(false)}
        >
          <div className={styles.modalContent}>
            {responseModalContent()}
            <button onClick={() => setShowResponseModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* <h1>Deck Detective</h1> */}
      {/* Opponent's search cards */}
      {Object.entries(playerList).map(([playerId, playerObj]) => (
        <div key={playerId}>
          <h2>{playerObj.name}</h2>
          <div className={styles.cardRow}>
            {myBoardInfo[playerId].searchCards.map((card, idx) => (
              <div key={idx} className={styles.cards}>
                <SearchCard card={card} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Self cards (weapon and search) */}
      <h1>Detective {myName}</h1>
      <div className={styles.cardRow}>
        {myBoardInfo[myPeerId].searchCards.map((card, idx) => (
          <div
            key={idx}
            className={`${styles.cards} ${styles.clickable}`}
            onClick={() => handleSearchCardClick(card, idx)}
          >
            <SearchCard card={card} />
          </div>
        ))}
      </div>
      <br />
      <div className={styles.cardRow}>
        {myBoardInfo[myPeerId].weaponCards.map((card, idx) => (
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
  // sendPrivate: PropTypes.func.isRequired,
  playerList: PropTypes.object.isRequired,
  boardInfo: PropTypes.object.isRequired,
};

export default GamePage;
