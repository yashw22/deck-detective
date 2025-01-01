import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import PropTypes from "prop-types";

import styles from "./GamePageNew.module.css";

import SearchCard from "../Cards/SearchCard";
import ElementCard from "../Cards/ElementCard";
import {
  COLORS,
  COUNTS,
  ELEMENTS_TYPE,
  S_NAME_LEN,
  WEAPONS,
} from "../../config/constants";
import { getHex, getString } from "../../utils/helpers";
import { getCardMatches, pickNextSearchCard } from "../../utils/gameUtil";

import InvestigationSheetNew from "../InvestigationSheet/InvestigationSheetNew";
import Notes from "../Notes";

import useLongPress from "../../hooks/useLongPress";

const getNameForSheet = (name) => {
  return name.length >= S_NAME_LEN
    ? name.substring(0, S_NAME_LEN).toLowerCase()
    : name.toLowerCase();
};

const GamePageNew = forwardRef(function GamePageNew(
  { myPeerId, sendBroadcast, playerList, boardInfo },
  ref
) {
  const [boardState, setBoardState] = useState(boardInfo);
  const [navbarActiveItem, setNavbarActiveItem] = useState("weaponCards");
  const [infobarMsg, setInfobarMsg] = useState(() => {
    if (boardState.turnQ[0] === myPeerId) return "Your turn...";
    else return `${boardState[boardInfo.turnQ[0]].name} 's  turn...`;
  });

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSearchModalPlayers, setShowSearchModalPlayers] = useState();
  const [showLastResponseModal, setShowLastResponseModal] = useState(false);
  const [showGuessModal, setShowGuessModal] = useState(false);

  const [pickedSearchCard, setPickedSearchCard] = useState();
  const [pickedSearchCardIdx, setPickedSearchCardIdx] = useState();
  const [searchFreeElement, setSearchFreeElement] = useState({});
  const [lastResponse, setLastResponse] = useState();
  const [finalGuessElements, setFinalGuessElements] = useState({});
  const [hasPlayerGuessed, setHasPlayerGuessed] = useState(false);
  // const [isGuessCorrect, setIsGuessCorrect] = useState(false);

  const playersNameList = boardInfo.turnQ.map((peerId) =>
    getNameForSheet(boardInfo[peerId].name)
  );
  const memoPlayerNames = useMemo(() => playersNameList, [playersNameList]);

  useImperativeHandle(ref, () => ({
    setResponse: (data) => {
      // console.log(boardState);
      if (
        data.info === "searchResponse" ||
        data.info === "searchReplaceResponse"
      ) {
        if (data.boardInfo.turnQ[0] === myPeerId) setInfobarMsg("Your turn...");
        else
          setInfobarMsg(
            `${boardInfo[data.boardInfo.turnQ[0]].name} 's  turn...`
          );
        setLastResponse(data);
        setBoardState(data.boardInfo);
        setShowLastResponseModal(true);
      } else if (data.info === "guessedHiddenCard") {
        if (data.isGuessCorrect || data.boardInfo.turnQ.length === 1) {
          setHasPlayerGuessed(true);
          setInfobarMsg("Game over!!");
        } else if (data.boardInfo.turnQ[0] === myPeerId)
          setInfobarMsg("Your turn...");
        else
          setInfobarMsg(
            `${boardInfo[data.boardInfo.turnQ[0]].name} 's  turn...`
          );
        setLastResponse(data);
        setBoardState(data.boardInfo);
        setShowLastResponseModal(true);
      }
    },
  }));

  const navbarSearchCardsLongPressHandler = useLongPress(() => {
    const isTrue = confirm("Sure you wanna replace all your Search Cards?");
    if (isTrue) {
      let newPlayerSearchDeck = [];

      for (let i = 0; i < 4; i++) {
        const [nextSearchCard, newSearchDeck, newUsedDeck] = pickNextSearchCard(
          boardState.searchDeck,
          boardState.usedDeck
        );
        newPlayerSearchDeck.push(nextSearchCard);
        boardState.searchDeck = newSearchDeck;
        boardState.usedDeck = newUsedDeck;
      }
      boardState.usedDeck = [
        ...boardState.usedDeck,
        ...boardState[myPeerId].searchCards,
      ];
      boardState[myPeerId].searchCards = newPlayerSearchDeck;

      boardState.turnQ = [...boardState.turnQ.slice(1), boardState.turnQ[0]];
      setInfobarMsg(`${boardState[boardState.turnQ[0]].name} 's  turn...`);

      setBoardState(boardState);
      const responseData = {
        info: "searchReplaceResponse",
        from: myPeerId,
        boardInfo: boardState,
      };
      sendBroadcast(responseData);
      setLastResponse(responseData);
      setShowLastResponseModal(true);
    }
  });

  const handleSearchCardClick = (card, cardIdx) => {
    setPickedSearchCard(card);
    setPickedSearchCardIdx(cardIdx);

    if ("free" in card) setShowSearchModalPlayers(false);
    else setShowSearchModalPlayers(true);

    setShowSearchModal(true);
  };

  const handleSearchCardModalPlayerClick = (playerId) => {
    const [nextSearchCard, newSearchDeck, newUsedDeck] = pickNextSearchCard(
      boardState.searchDeck,
      boardState.usedDeck
    );
    boardState[myPeerId].searchCards[pickedSearchCardIdx] = nextSearchCard;
    boardState.searchDeck = newSearchDeck;
    boardState.usedDeck = [...newUsedDeck, pickedSearchCard];

    boardState.turnQ = [...boardState.turnQ.slice(1), boardState.turnQ[0]];
    setInfobarMsg(`${boardState[boardState.turnQ[0]].name} 's  turn...`);

    const res = getCardMatches(
      { ...pickedSearchCard, ...searchFreeElement },
      boardState[playerId].weaponCards
    );

    setBoardState(boardState);
    const responseData = {
      info: "searchResponse",
      searchCard: pickedSearchCard,
      freeChoice: searchFreeElement,
      from: myPeerId,
      to: playerId,
      res: res,
      boardInfo: boardState,
    };
    sendBroadcast(responseData);
    setLastResponse(responseData);

    setSearchFreeElement({});
    setShowSearchModal(false);

    setShowLastResponseModal(true);
  };

  const handleFinalGuessClick = () => {
    if (
      boardState.turnQ[0] === myPeerId &&
      Object.keys(finalGuessElements).length === 3
    ) {
      let isCorrect = false;
      if (
        finalGuessElements.weapon === boardState.resultCard.weapon &&
        finalGuessElements.count === boardState.resultCard.count &&
        finalGuessElements.color === boardState.resultCard.color
      ) {
        // setIsGuessCorrect(true);
        isCorrect = true;
      }

      boardState.turnQ = boardState.turnQ.slice(1);
      if (isCorrect || boardState.turnQ.length === 1) {
        setHasPlayerGuessed(true);
        setInfobarMsg("Game over!!");
      } else
        setInfobarMsg(`${boardState[boardState.turnQ[0]].name} 's  turn...`);

      setBoardState(boardState);
      const responseData = {
        info: "guessedHiddenCard",
        isGuessCorrect: isCorrect,
        from: myPeerId,
        boardInfo: boardState,
      };
      sendBroadcast(responseData);
      setLastResponse(responseData);

      setHasPlayerGuessed(true);
      setShowGuessModal(false);
      setShowLastResponseModal(true);
    }
  };

  // UI renders
  const getSearchCardModalChoiceContent = () => (
    <>
      <h2>Choose Free Element</h2>
      <div className={styles.card}>
        <SearchCard card={pickedSearchCard} />
      </div>
      {ELEMENTS_TYPE.filter(
        (itemsType) => !(itemsType in pickedSearchCard)
      ).map((itemsType) => (
        <ModalBtnRow
          key={itemsType}
          modalType="freeChoice"
          itemsType={itemsType}
          resList={searchFreeElement}
          setResList={setSearchFreeElement}
          setNextModal={setShowSearchModalPlayers}
        />
      ))}
    </>
  );
  const getSearchCardModalPlayerContent = () => (
    <>
      <h2>Select player to ask</h2>
      <div className={styles.card}>
        <SearchCard card={pickedSearchCard} />
      </div>
      {Object.keys(searchFreeElement).length !== 0 && (
        <div>
          <br />
          [free choice]: {getString(Object.values(searchFreeElement)[0])}
        </div>
      )}
      <div className={styles.modalBtnRow}>
        {Object.entries(playerList).map(([playerId, playerObj]) => (
          <div
            key={playerId}
            className={styles.modalBtn}
            onClick={() => handleSearchCardModalPlayerClick(playerId)}
          >
            {playerObj.name}
          </div>
        ))}
      </div>
    </>
  );
  const getSearchModal = () => {
    return (
      <div
        id="modal-overlay"
        className={styles.modalOverlay}
        onClick={(e) => {
          if (e.target.id == "modal-overlay") {
            setShowSearchModal(false);
            setSearchFreeElement({});
          }
        }}
      >
        <div className={styles.modalContent}>
          {showSearchModalPlayers
            ? getSearchCardModalPlayerContent()
            : getSearchCardModalChoiceContent()}
        </div>
      </div>
    );
  };

  const getLastResModalCards = () => {
    if (
      lastResponse.from === myPeerId &&
      lastResponse.searchCard.elementsCount === 2
    )
      return (
        <div className={styles.cardRow}>
          <CardRow
            cards={lastResponse.res}
            cardType="weapon"
            isClickable={false}
          />
        </div>
      );
  };
  const getLastResponseModal = () => {
    if (lastResponse.info === "guessedHiddenCard") {
      const msg = lastResponse.isGuessCorrect
        ? lastResponse.from === myPeerId
          ? "You guessed the Hidden Card. You Won!!"
          : `${boardState[lastResponse.from].name} guessed the card. They Won!!`
        : lastResponse.boardInfo.turnQ.length !== 1
        ? lastResponse.from === myPeerId
          ? "You guessed wrong. You lost and are out of the game!!"
          : `${
              boardState[lastResponse.from].name
            } guessed wrong. They lost and are out of the game!!`
        : lastResponse.boardInfo.turnQ[0] === myPeerId
        ? `${boardState[lastResponse.from].name} guessed wrong. You Won!!`
        : `${boardState[lastResponse.from].name} guessed wrong. ${
            boardState[lastResponse.boardInfo.turnQ[0]].name
          } Won!!`;

      return (
        <div
          id="modal-overlay"
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target.id == "modal-overlay") setShowLastResponseModal(false);
          }}
        >
          <div className={styles.modalContent}>
            <h2>{msg}</h2>
            {(lastResponse.isGuessCorrect ||
              lastResponse.boardInfo.turnQ.length === 1) && (
              <div className={styles.card}>
                <ElementCard card={boardState.resultCard} />
              </div>
            )}
            {/* <div className={styles.modalBtn} >
                Start new Game
              </div> */}
          </div>
        </div>
      );
    }

    if (lastResponse.info === "searchReplaceResponse")
      return (
        <div
          id="modal-overlay"
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target.id == "modal-overlay") setShowLastResponseModal(false);
          }}
        >
          <div className={styles.modalContent}>
            <h2>
              <span className={styles.focus}>
                {boardState[lastResponse.from].name}
              </span>{" "}
              replaced all their Search Cards.
            </h2>
          </div>
        </div>
      );

    if (lastResponse.info === "searchResponse")
      return (
        <div
          id="modal-overlay"
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target.id == "modal-overlay") setShowLastResponseModal(false);
          }}
        >
          <div className={styles.modalContent}>
            <h2>
              <span className={styles.focus}>
                {boardState[lastResponse.from].name}
              </span>{" "}
              asked{" "}
              <span className={styles.focus}>
                {boardState[lastResponse.to].name}
              </span>
            </h2>
            <div className={styles.card}>
              <SearchCard card={lastResponse.searchCard} />
            </div>
            {Object.keys(lastResponse.freeChoice).length !== 0 && (
              <div>
                <br />
                [free choice]:{" "}
                {getString(Object.values(lastResponse.freeChoice)[0])}
              </div>
            )}
            {getLastResModalCards()}
            <br />
            <div>
              No. of cards:{" "}
              <span className={styles.focus}>{lastResponse.res.length}</span>
            </div>
          </div>
        </div>
      );
  };

  const getGuessModal = () => {
    return (
      <div
        id="modal-overlay"
        className={styles.modalOverlay}
        onClick={(e) => {
          if (e.target.id == "modal-overlay") setShowGuessModal(false);
        }}
      >
        <div className={styles.modalContent}>
          <h2>Guess Hidden Card</h2>
          {Array.from(ELEMENTS_TYPE, (itemsType) => (
            <ModalBtnRow
              key={itemsType}
              modalType="finalGuess"
              itemsType={itemsType}
              resList={finalGuessElements}
              setResList={setFinalGuessElements}
            />
          ))}
          <div className={styles.modalBtn} onClick={handleFinalGuessClick}>
            Submit
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Search Card Modal */}
      {showSearchModal && getSearchModal()}
      {/* Last Response Modal */}
      {showLastResponseModal && getLastResponseModal()}
      {/* Final Guess Modal */}
      {showGuessModal && getGuessModal()}

      {/* infobar header */}
      <div className={styles.infobar}>
        <div
          className={styles.infobarBtn}
          onClick={() => {
            if (lastResponse) setShowLastResponseModal(true);
          }}
        >
          Last response
        </div>
        <div>{infobarMsg}</div>
        <div
          className={styles.infobarBtn}
          onClick={() => {
            if (!hasPlayerGuessed) setShowGuessModal(true);
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
        {navbarActiveItem === "weaponCards" && (
          <CardRow
            cards={boardState[myPeerId].weaponCards}
            cardType="weapon"
            isClickable={false}
          />
        )}
        {navbarActiveItem === "commonCards" && (
          <CardRow
            cards={boardState.commonCards}
            cardType="weapon"
            isClickable={false}
          />
        )}
        {navbarActiveItem === "searchCards" && (
          <CardRow
            cards={boardState[myPeerId].searchCards}
            cardType="search"
            isClickable={boardState.turnQ[0] === myPeerId && !hasPlayerGuessed}
            handleClick={handleSearchCardClick}
          />
        )}
        {navbarActiveItem === "otherSearchCards" && (
          <div className={styles.cardRow}>
            {Object.entries(playerList).map(([playerId, playerObj]) => (
              <div className={styles.oscBox} key={playerId}>
                <span className={styles.oscTitle}>{playerObj.name}</span>
                {boardState[playerId].searchCards.map((card, idx) => (
                  <div key={idx} className={styles.card}>
                    <SearchCard card={card} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {navbarActiveItem === "notes" && (
          <div className={styles.notes}>
            <Notes players={memoPlayerNames} />
          </div>
        )}
      </div>

      {/* navbar footer */}
      <div className={styles.navbar}>
        <NavBtn
          isActive={navbarActiveItem === "weaponCards"}
          handleClick={() => setNavbarActiveItem("weaponCards")}
          text={`Weapon Cards: ${boardState[myPeerId].weaponCards.length}`}
        />
        <NavBtn
          isActive={navbarActiveItem === "commonCards"}
          handleClick={() => setNavbarActiveItem("commonCards")}
          text={"Common Cards"}
        />
        <NavBtn
          isActive={navbarActiveItem === "searchCards"}
          handleClick={() => setNavbarActiveItem("searchCards")}
          text={"Search Cards"}
          longPressHandler={navbarSearchCardsLongPressHandler}
          isLongPressable={
            boardState.turnQ[0] === myPeerId && !hasPlayerGuessed
          }
        />
        <NavBtn
          isActive={navbarActiveItem === "otherSearchCards"}
          handleClick={() => setNavbarActiveItem("otherSearchCards")}
          text={"Others"}
        />
        <NavBtn
          isActive={navbarActiveItem === "notes"}
          handleClick={() => setNavbarActiveItem("notes")}
          text={"Notes"}
        />
      </div>
    </div>
  );
});
GamePageNew.propTypes = {
  myPeerId: PropTypes.string.isRequired,
  sendBroadcast: PropTypes.func.isRequired,
  playerList: PropTypes.object.isRequired,
  boardInfo: PropTypes.object.isRequired,
};
export default GamePageNew;

function ModalBtnRow({
  modalType,
  itemsType,
  resList,
  setResList,
  setNextModal,
}) {
  const items =
    itemsType === "weapon"
      ? WEAPONS
      : itemsType === "color"
      ? COLORS
      : itemsType === "count"
      ? COUNTS
      : null;

  return (
    <div className={styles.modalBtnRow}>
      {items.map((item) => (
        <div
          className={styles.modalBtn}
          key={item}
          onClick={() => {
            if (modalType === "finalGuess")
              setResList((f) => ({ ...f, [itemsType]: item }));
            else if (modalType === "freeChoice") {
              setResList({ [itemsType]: item });
              setNextModal(true);
            }
          }}
          style={{
            backgroundColor:
              itemsType === "color" ? getHex(item) : "hsl(0, 0%, 80%)",
            outline:
              itemsType in resList && resList[itemsType] === item
                ? itemsType === "color"
                  ? "3px solid white"
                  : "3px solid #ffcc00"
                : "",
          }}
        >
          {itemsType === "color" ? <span>&nbsp;</span> : getString(item)}
        </div>
      ))}
    </div>
  );
}
ModalBtnRow.propTypes = {
  modalType: PropTypes.string.isRequired,
  itemsType: PropTypes.string.isRequired,
  resList: PropTypes.object,
  setResList: PropTypes.func,
  setNextModal: PropTypes.func,
};

function CardRow({ cards, cardType, isClickable, handleClick }) {
  return (
    <div className={styles.cardRow}>
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
    </div>
  );
}
CardRow.propTypes = {
  cards: PropTypes.array.isRequired,
  cardType: PropTypes.string.isRequired,
  isClickable: PropTypes.bool.isRequired,
  handleClick: PropTypes.func,
};

function NavBtn({
  text,
  isActive,
  handleClick,
  isLongPressable = false,
  longPressHandler = {},
}) {
  return (
    <button
      className={`${styles.navButton} ${
        isActive ? styles.navButtonActive : ""
      }`}
      onClick={handleClick}
      {...(isLongPressable ? longPressHandler : {})}
    >
      {text}
    </button>
  );
}
NavBtn.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  isLongPressable: PropTypes.bool,
  longPressHandler: PropTypes.object,
};
