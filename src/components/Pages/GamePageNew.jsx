import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import PropTypes from "prop-types";

import styles from "./GamePageNew.module.css";

import SearchCard from "../Cards/SearchCard";
import ElementCard from "../Cards/ElementCard";
import { COLORS, COUNTS, S_NAME_LEN, WEAPONS } from "../../config/constants";
import { getHex, getString, lightenHex } from "../../utils/helpers";
import { getCardMatches, pickNextSearchCard } from "../../utils/gameUtil";

import InvestigationSheetNew from "../InvestigationSheet/InvestigationSheetNew";
import Notes from "../Notes";

const getNameForSheet = (name) => {
  return name.length >= S_NAME_LEN
    ? name.substring(0, S_NAME_LEN).toLowerCase()
    : name.toLowerCase();
};

const GamePageNew = forwardRef(function GamePageNew(
  { myPeerId, myName, sendBroadcast, playerList, boardInfo },
  ref
) {
  const [myBoardInfo, setMyBoardInfo] = useState(boardInfo);
  const [navbarOption, setNavbarOption] = useState("weaponCards");
  const [showSearchCardModal, setShowSearchCardModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [finalCardModal, setFinalCardModal] = useState(false);
  const [resChecked, setResChecked] = useState(false);
  const [finalGuessElements, setFinalGuessElements] = useState({});
  const [resData, setResData] = useState(false);

  const [showPlayerSelect, setShowPlayerSelect] = useState();
  const [selectedCard, setSelectedCard] = useState();
  const [selectedCardIdx, setSelectedCardIdx] = useState();
  const [singleFree, setSingleFree] = useState(false);
  const [elementsChosen, setElementsChosen] = useState({});

  const [infobarStr, setInfobarStr] = useState(() => {
    if (myBoardInfo.turnQ[0] === myPeerId) return "Your turn...";
    else return `${myBoardInfo[boardInfo.turnQ[0]].name} 's  turn...`;
  });

  const memoPlayerNames = useMemo(
    () => [
      ...Object.values(playerList).map((obj) => getNameForSheet(obj.name)),
      getNameForSheet(myName),
    ],
    [playerList, myName]
  );

  // useEffect(() => console.log(currentTurn));

  useImperativeHandle(ref, () => ({
    setResponse: (data) => {
      if (data.info === "responseSearchCard") {
        if (data.boardInfo.turnQ[0] === myPeerId) setInfobarStr("Your turn...");
        else
          setInfobarStr(
            `${boardInfo[data.boardInfo.turnQ[0]].name} 's  turn...`
          );
        setResData(data);
        // console.log(data.boardInfo);
        // console.log(currentTurn)
        // console.log(data.boardInfo);
        setMyBoardInfo(data.boardInfo);
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
    myBoardInfo.turnQ = [...myBoardInfo.turnQ.slice(1), myBoardInfo.turnQ[0]];
    if (myBoardInfo.turnQ[0] === myPeerId) setInfobarStr("Your turn...");
    else setInfobarStr(`${myBoardInfo[myBoardInfo.turnQ[0]].name} 's  turn...`);
    setMyBoardInfo(myBoardInfo);
    // console.log(myBoardInfo);

    const res = getCardMatches(
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
          {WEAPONS.map((weapon) => (
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
              ({getString(weapon)})
            </div>
          ))}
        </div>
      )}
      {!("count" in selectedCard) && (
        <div className={styles.modalBtnRow}>
          {COUNTS.map((count) => (
            <div
              className={styles.modalBtn}
              key={count}
              onClick={() => handleModalElementBtn("count", count)}
              style={{
                backgroundColor:
                  "count" in elementsChosen && elementsChosen.count == count
                    ? "hsl(0, 0%, 60%)"
                    : "hsl(0, 0%, 80%)",
              }}
            >
              {count}
            </div>
          ))}
        </div>
      )}
      {!("color" in selectedCard) && (
        <div className={styles.modalBtnRow}>
          {COLORS.map((color) => (
            <div
              className={styles.modalBtn}
              key={color}
              onClick={() => handleModalElementBtn("color", color)}
              style={{
                backgroundColor:
                  "color" in elementsChosen && elementsChosen.color == color
                    ? lightenHex(color)
                    : getHex(color),
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
            <div key={idx} className={styles.card}>
              <ElementCard card={card} />
            </div>
          ))}
        </div>
      );
    }
  };

  const getResModalContent = () => {
    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setShowResponseModal(false)}
      >
        <div className={styles.modalContent}>
          <h2>
            {resData.from} asked {resData.to}
          </h2>
          <div className={styles.card}>
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
          <br />
          <div>No. of cards: {resData.res.length}</div>
        </div>
        {/* <button onClick={() => setShowResponseModal(false)}>Close</button> */}
      </div>
    );
  };

  const handleFinalCardGuess = () => {
    if (Object.keys(finalGuessElements).length === 3) {
      if (
        finalGuessElements.weapon === myBoardInfo.resultCard.weapon &&
        finalGuessElements.count === myBoardInfo.resultCard.count &&
        finalGuessElements.color === myBoardInfo.resultCard.color
      ) {
        setInfobarStr("Yow Won!!!");
      } else {
        setInfobarStr("Yow lost!!!");
      }
      setResChecked(true);
    }
    setFinalCardModal(false);
  };

  const getFinalCardGuessModal = () => {
    return (
      <div
        className={styles.modalOverlay}
        // onClick={() => setFinalCardModal(false)}
      >
        <div className={styles.modalContent}>
          <h2>Select final choices</h2>
          <div className={styles.modalBtnRow}>
            {WEAPONS.map((weapon) => (
              <div
                className={styles.modalBtn}
                key={weapon}
                onClick={() =>
                  setFinalGuessElements((f) => ({ ...f, weapon: weapon }))
                }
                style={{
                  backgroundColor:
                    "weapon" in finalGuessElements &&
                    finalGuessElements.weapon == weapon
                      ? "hsl(0, 0%, 60%)"
                      : "hsl(0, 0%, 80%)",
                }}
              >
                ({getString(weapon)})
              </div>
            ))}
          </div>
          <div className={styles.modalBtnRow}>
            {COUNTS.map((count) => (
              <div
                className={styles.modalBtn}
                key={count}
                onClick={() =>
                  setFinalGuessElements((f) => ({ ...f, count: count }))
                }
                style={{
                  backgroundColor:
                    "count" in finalGuessElements &&
                    finalGuessElements.count == count
                      ? "hsl(0, 0%, 60%)"
                      : "hsl(0, 0%, 80%)",
                }}
              >
                {count}
              </div>
            ))}
          </div>
          <div className={styles.modalBtnRow}>
            {COLORS.map((color) => (
              <div
                className={styles.modalBtn}
                key={color}
                onClick={() =>
                  setFinalGuessElements((f) => ({ ...f, color: color }))
                }
                style={{
                  backgroundColor:
                    "color" in finalGuessElements &&
                    finalGuessElements.color == color
                      ? lightenHex(color)
                      : getHex(color),
                }}
              >
                &nbsp;
              </div>
            ))}
          </div>
          <div className={styles.modalBtn} onClick={handleFinalCardGuess}>
            Submit
          </div>
          <div
            className={styles.modalBtn}
            onClick={() => setFinalCardModal(false)}
          >
            Close
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Response Modal */}
      {showResponseModal && getResModalContent()}

      {/* FInal Guess Modal */}
      {finalCardModal && getFinalCardGuessModal()}

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

      {/* infobar header */}
      <div className={styles.infobar}>
        <div
          className={styles.infobarBtn}
          onClick={() => {
            if (resData) setShowResponseModal(true);
          }}
        >
          Last response
        </div>
        <div>{infobarStr}</div>
        <div
          className={styles.infobarBtn}
          onClick={() => {
            if (!resChecked) setFinalCardModal(true);
          }}
        >
          Guess Card
        </div>
      </div>

      {/* sheet content */}
      <div className={styles.sheetContainer}>
        {/* <div className={styles.sheet}> */}
          <InvestigationSheetNew players={memoPlayerNames} />
        {/* </div>   */}
      </div>

      {/* dynamic box content */}
      <div className={styles.dynamicBox}>
        {navbarOption === "weaponCards" && (
          <div className={styles.cardRow}>
            <CardRow
              cards={myBoardInfo[myPeerId].weaponCards}
              cardType="weapon"
              isClickable={false}
            />
          </div>
        )}
        {navbarOption === "commonCards" && (
          <div className={styles.cardRow}>
            <CardRow
              cards={myBoardInfo.commonCards}
              cardType="weapon"
              isClickable={false}
            />{" "}
          </div>
        )}
        {navbarOption === "searchCards" && (
          <div className={styles.cardRow}>
            <CardRow
              cards={myBoardInfo[myPeerId].searchCards}
              cardType="search"
              isClickable={myBoardInfo.turnQ[0] === myPeerId}
              handleClick={handleSearchCardClick}
            />
          </div>
        )}
        {navbarOption === "otherSearchCards" && (
          <div className={styles.cardRow}>
            {Object.entries(playerList).map(([playerId, playerObj]) => (
              <div className={styles.oscBox} key={playerId}>
                <span className={styles.oscTitle}>{playerObj.name}</span>
                <CardRow
                  cards={myBoardInfo[playerId].searchCards}
                  cardType="search"
                  isClickable={false}
                />
              </div>
            ))}
          </div>
        )}
        {navbarOption === "notes" && (
          <div className={styles.notes}>
            <Notes players={memoPlayerNames} />
          </div>
        )}
      </div>

      {/* navbar footer */}
      <div className={styles.navbar}>
        <NavBtn
          isActive={navbarOption === "weaponCards"}
          handleClick={() => setNavbarOption("weaponCards")}
          text={`Weapon Cards: ${myBoardInfo[myPeerId].weaponCards.length}`}
        />
        <NavBtn
          isActive={navbarOption === "commonCards"}
          handleClick={() => setNavbarOption("commonCards")}
          text={"Common Cards"}
        />
        <NavBtn
          isActive={navbarOption === "searchCards"}
          handleClick={() => setNavbarOption("searchCards")}
          text={"Search Cards"}
        />
        <NavBtn
          isActive={navbarOption === "otherSearchCards"}
          handleClick={() => setNavbarOption("otherSearchCards")}
          text={"Others"}
        />
        <NavBtn
          isActive={navbarOption === "notes"}
          handleClick={() => setNavbarOption("notes")}
          text={"Notes"}
        />
      </div>
    </div>
  );
});

GamePageNew.propTypes = {
  myPeerId: PropTypes.string.isRequired,
  myName: PropTypes.string.isRequired,
  sendBroadcast: PropTypes.func.isRequired,
  playerList: PropTypes.object.isRequired,
  boardInfo: PropTypes.object.isRequired,
};

export default GamePageNew;

function CardRow({ cards, cardType, isClickable, handleClick }) {
  return (
    <>
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${styles.card} ${isClickable ? styles.clickable : ""}`}
          onClick={() => {
            if (isClickable) handleClick(card, idx);
          }}
        >
          {cardType == "weapon" && <ElementCard card={card} />}
          {cardType == "search" && <SearchCard card={card} />}
        </div>
      ))}
    </>
  );
}
CardRow.propTypes = {
  cards: PropTypes.array.isRequired,
  cardType: PropTypes.string.isRequired,
  isClickable: PropTypes.bool.isRequired,
  handleClick: PropTypes.func,
};

function NavBtn({ text, isActive, handleClick }) {
  return (
    <button
      className={`${styles.navButton} ${
        isActive ? styles.navButtonActive : ""
      }`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
NavBtn.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};
