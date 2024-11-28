import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
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

import InvestigationSheet from "../InvestigationSheet/InvestigationSheet";

const nameLen = 3;

const GamePage = forwardRef(function GamePage(
  { myPeerId, myName, sendBroadcast, playerList, boardInfo },
  ref
) {
  const [myBoardInfo, setMyBoardInfo] = useState(boardInfo);
  const [navbarOption, setNavbarOption] = useState("GameBoard");
  const [showSearchCardModal, setShowSearchCardModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [resData, setResData] = useState(false);

  const [showPlayerSelect, setShowPlayerSelect] = useState();
  const [selectedCard, setSelectedCard] = useState();
  const [selectedCardIdx, setSelectedCardIdx] = useState();
  const [singleFree, setSingleFree] = useState(false);
  const [elementsChosen, setElementsChosen] = useState({});

  const memoPlayerNames = useMemo(
    () => [
      ...Object.values(playerList).map((obj) =>
        obj.name.length >= nameLen ? obj.name.substring(0, nameLen) : obj.name
      ),
      myName.length >= nameLen ? myName.substring(0, nameLen) : myName,
    ],
    [playerList, myName]
  );

  useImperativeHandle(ref, () => ({
    setResponse: (data) => {
      // console.log("got response", data);
      if (data.info === "responseSearchCard") {
        setResData(data);
        // console.log(myBoardInfo);
        // console.log(data.boardInfo);
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
    myBoardInfo.searchDeck = newSearchDeck;
    myBoardInfo.usedDeck = newUsedDeck;
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
      res: res,
      boardInfo: myBoardInfo,
    });

    setElementsChosen({});
    setShowSearchCardModal(false);

    setResData({
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

  const getSearchResponseContent = () => {
    if (
      resData.info === "selfSearchCard" &&
      (resData.searchCard.elementsCount === 2 || "free" in resData.searchCard)
    ) {
      return (
        <div className={styles.cardRow}>
          {resData.res.map((card, idx) => (
            <div key={idx} className={styles.cards}>
              <ElementCard card={card} />
            </div>
          ))}
        </div>
      );
    }
  };

  const getResModalContent = () => {
    return (
      <>
        <h2>
          {resData.from} asked {resData.to}
        </h2>
        <div className={styles.cards}>
          <SearchCard card={resData.searchCard} />
        </div>
        {Object.keys(resData.freeChoice).length !== 0 && (
          <div>
            <span>[choice] &nbsp;</span>
            {Object.entries(resData.freeChoice).map(([element, value]) => (
              <span key={element}>
                {element}: {value} &nbsp;&nbsp;
              </span>
            ))}
          </div>
        )}
        {getSearchResponseContent()}
        <div>No. of cards: {resData.res.length}</div>
      </>
    );
  };

  const getGameBoard = () => (
    <div className={styles.gameBoardContainer}>
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
            {getResModalContent()}
            {/* <button onClick={() => setShowResponseModal(false)}>Close</button> */}
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

  return (
    <div className={styles.container}>
      <div className={styles.infobar}>
        <div>InfoBar</div>
      </div>
      <div className={styles.contentContainer}>
        {navbarOption === "GameBoard" && getGameBoard()}
        {navbarOption === "InvestigationSheet" && (
          <InvestigationSheet players={memoPlayerNames} />
        )}
      </div>
      <div className={styles.navbar}>
        <button
          className={`${styles.navButton} ${
            navbarOption === "GameBoard" ? styles.navButtonActive : ""
          }`}
          onClick={() => setNavbarOption("GameBoard")}
        >
          Board
        </button>
        <button
          // className={styles.navButton}
          className={`${styles.navButton} ${
            navbarOption === "InvestigationSheet" ? styles.navButtonActive : ""
          }`}
          onClick={() => setNavbarOption("InvestigationSheet")}
        >
          Investigation Sheet
        </button>
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
