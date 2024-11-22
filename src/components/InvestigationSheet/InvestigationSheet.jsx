import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  colorElements,
  typeElements,
  weaponElements,
} from "../../lib/constants";
// import Grid from "./Grid/Grid";
import GridCell from "./GridCell";

import styles from "./InvestigationSheet.module.css";
import { getCardWeaponIcon } from "../../lib/utils";

const initBoxFeatures = (players) => {
  const features = {};
  weaponElements.forEach((weapon) => {
    typeElements.forEach((type) => {
      colorElements.forEach((color) => {
        features[weapon + type + color] = {
          weapon: weapon,
          type: type,
          color: color,
          valsB1: Object.fromEntries(players.map((key) => [key, false])),
          valsB2: Object.fromEntries(players.map((key) => [key, false])),
          focusB0: false,
          focusB1: false,
          focusB2: false,
          marked: false,
          common: false,
          label: "",
        };
      });
    });
  });
  return features;
};

const initPlayerTally = (players) => {
  const playerTally = {};
  players.forEach((player) => (playerTally[player] = 0));
  return playerTally;
};
const initPlayerNotes = (players) => {
  const playerNotes = {};
  players.forEach((player) => (playerNotes[player] = ""));
  return playerNotes;
};

export default function InvestigationSheet({ players }) {
  var [boxKey, setBoxKey] = useState(null);
  var [boxIdx, setBoxIdx] = useState(null);
  const [boxFeatures, setBoxFeatures] = useState(initBoxFeatures(players));
  const [commonCount, setCommonCount] = useState(0);
  const [playerTally, setPlayerTally] = useState(initPlayerTally(players));
  const [notesData, setNotesData] = useState(initPlayerNotes(players));

  useEffect(() => {
    const ls_boxFeatures = localStorage.getItem("is_boxFeatures");
    if (ls_boxFeatures) setBoxFeatures(JSON.parse(ls_boxFeatures));
    const ls_commonCount = localStorage.getItem("is_commonCount");
    if (ls_commonCount) setCommonCount(JSON.parse(ls_commonCount));
    const ls_playerTally = localStorage.getItem("isNotes_tally");
    if (ls_playerTally) setPlayerTally(JSON.parse(ls_playerTally));
    const ls_notesData = localStorage.getItem("isNotes_data");
    if (ls_notesData) setNotesData(JSON.parse(ls_notesData));
  }, []);
  useEffect(
    () => localStorage.setItem("is_boxFeatures", JSON.stringify(boxFeatures)),
    [boxFeatures]
  );
  useEffect(
    () => localStorage.setItem("is_commonCount", JSON.stringify(commonCount)),
    [commonCount]
  );
  useEffect(
    () => localStorage.setItem("isNotes_tally", JSON.stringify(playerTally)),
    [playerTally]
  );
  useEffect(
    () => localStorage.setItem("isNotes_data", JSON.stringify(notesData)),
    [notesData]
  );

  // helper functions
  const handleBoxClick = (newKey, newIdx) => {
    if (boxIdx !== null) {
      setBoxFeatures((b) => ({
        ...b,
        [boxKey]: { ...b[boxKey], ["focusB" + boxIdx]: false },
      }));
    }
    setBoxFeatures((b) => ({
      ...b,
      [newKey]: { ...b[newKey], ["focusB" + newIdx]: true },
    }));
    setBoxKey(newKey);
    setBoxIdx(newIdx);
  };
  const handlePlayerClick = (player) => {
    const valKey = "valsB" + boxIdx;
    if (
      boxIdx !== null &&
      !boxFeatures[boxKey].common &&
      !boxFeatures[boxKey].marked
    ) {
      setBoxFeatures((b) => ({
        ...b,
        [boxKey]: {
          ...b[boxKey],
          [valKey]: {
            ...b[boxKey][valKey],
            [player]: !b[boxKey][valKey][player],
          },
        },
      }));
    }
  };
  const handlePlayerCrossClick = (player) => {
    if (boxIdx !== null && !boxFeatures[boxKey].common) {
      if (!boxFeatures[boxKey].marked) {
        setPlayerTally((p) => ({ ...p, [player]: p[player] + 1 }));
        setBoxFeatures((b) => ({
          ...b,
          [boxKey]: { ...b[boxKey], marked: true, label: player },
        }));
      } else {
        const label = boxFeatures[boxKey].label;
        if (label === player) {
          setPlayerTally((p) => ({
            ...p,
            [player]: p[player] === 0 ? 0 : p[player] - 1,
          }));
          setBoxFeatures((b) => ({
            ...b,
            [boxKey]: { ...b[boxKey], marked: false, label: "" },
          }));
        } else {
          setPlayerTally((p) => ({
            ...p,
            [label]: p[label] === 0 ? 0 : p[label] - 1,
            [player]: p[player] + 1,
          }));
          setBoxFeatures((b) => ({
            ...b,
            [boxKey]: { ...b[boxKey], marked: true, label: player },
          }));
        }
      }
    }
  };
  const handleCommonClick = () => {
    if (boxIdx !== null) {
      if (!boxFeatures[boxKey].common) {
        setCommonCount((c) => c + 1);
        if (boxFeatures[boxKey].marked) {
          const label = boxFeatures[boxKey].label;
          setPlayerTally((p) => ({
            ...p,
            [label]: p[label] === 0 ? 0 : p[label] - 1,
          }));
          setBoxFeatures((b) => ({
            ...b,
            [boxKey]: { ...b[boxKey], common: true, marked: false, label: "" },
          }));
        } else {
          setBoxFeatures((b) => ({
            ...b,
            [boxKey]: { ...b[boxKey], common: true },
          }));
        }
      } else {
        setCommonCount((c) => c - 1);
        setBoxFeatures((b) => ({
          ...b,
          [boxKey]: { ...b[boxKey], common: false },
        }));
      }
    }
  };
  const handleClearClick = () => {
    if (
      boxIdx !== null &&
      !boxFeatures[boxKey].common &&
      !boxFeatures[boxKey].marked
    ) {
      setBoxFeatures((b) => ({
        ...b,
        [boxKey]: {
          ...b[boxKey],
          valsB1: Object.fromEntries(players.map((key) => [key, false])),
          valsB2: Object.fromEntries(players.map((key) => [key, false])),
        },
      }));
    }
  };
  const handleResetClick = () => {
    const userResponse = confirm("You are about to wipe all data. Proceed?");
    if (userResponse) {
      setBoxKey(null);
      setBoxIdx(null);
      setBoxFeatures(initBoxFeatures(players));
      setCommonCount(0);
      setPlayerTally(initPlayerTally(players));
      setNotesData(initPlayerNotes(players));
    }
  };

  const handleDecrementClick = (player) => {
    setPlayerTally((p) => ({ ...p, [player]: p[player] - 1 }));
  };
  const handleIncrementClick = (player) => {
    setPlayerTally((p) => ({ ...p, [player]: p[player] + 1 }));
  };

  // UI renders
  const getTypeRow = (weapon, type) => (
    <div className={styles.typeRow} key={weapon + type}>
      <div className={styles.typeHeader}>
        {getCardWeaponIcon(weapon).repeat(type)}
      </div>

      {colorElements.map((color) => {
        const boxKey = weapon + type + color;
        return (
          <GridCell
            key={boxKey}
            feature={boxFeatures[boxKey]}
            onBoxClick={handleBoxClick}
          />
        );
      })}
    </div>
  );
  const getWeaponGrid = (weapon) => (
    <div className={styles.weaponGrid} key={weapon}>
      <div className={styles.weaponHeader}>
        {weapon} ({getCardWeaponIcon(weapon)})
      </div>
      {typeElements.map((type) => getTypeRow(weapon, type))}
    </div>
  );

  return (
    <div className={styles.outerContainer}>
      <div className={styles.header}>Investigation Sheet</div>

      <div id="gridContainer" className={styles.gridContainer}>
        {weaponElements.map((weapon) => getWeaponGrid(weapon))}
      </div>

      {/* Button Panel */}
      <div>
        <div className={styles.buttonContainer}>
          {players.map((player) => (
            <div key={"button-" + player} className={styles.topBtn}>
              <div
                className={`${styles.topBtnL} ${
                  boxIdx === 0 &&
                  (boxFeatures[boxKey].label === player ||
                    (!(
                      boxFeatures[boxKey].marked || boxFeatures[boxKey].common
                    ) &&
                      (boxFeatures[boxKey].valsB1[player] ||
                        boxFeatures[boxKey].valsB2[player])))
                    ? styles.btnGreenBg
                    : styles.btnGrayBg
                }`}
                onClick={() => handlePlayerClick(player)}
              >
                {player}
              </div>
              <div
                className={`${styles.topBtnR} ${
                  boxIdx === 0 &&
                  (boxFeatures[boxKey].label === player ||
                    (!(
                      boxFeatures[boxKey].marked || boxFeatures[boxKey].common
                    ) &&
                      (boxFeatures[boxKey].valsB1[player] ||
                        boxFeatures[boxKey].valsB2[player])))
                    ? styles.btnGreenBg
                    : styles.btnGrayBg
                }`}
                onClick={() => handlePlayerCrossClick(player)}
              >
                X
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <div
            className={styles.lowerBtn}
            style={{ backgroundColor: "brown" }}
            onClick={handleCommonClick}
          >
            common: {commonCount}
          </div>
          <div className={styles.lowerBtn} onClick={handleClearClick}>
            clear
          </div>

          <div
            className={styles.lowerBtn}
            onClick={handleResetClick}
            style={{ backgroundColor: "red" }}
          >
            RESET
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className={styles.notesAreaContainer}>
        {players.map((player) => (
          <div key={"notes-" + player} className={styles.notesRowContainer}>
            <div className={styles.playerTallyGroup}>
              <div className={styles.playerTallyContents}>
                <div>{player}</div>:<div>{playerTally[player]}</div>
              </div>
              <div className={styles.playerTallyBtns}>
                <div onClick={() => handleDecrementClick(player)}>-</div>
                <div onClick={() => handleIncrementClick(player)}>+</div>
              </div>
            </div>
            <textarea
              className={styles.notesArea}
              spellCheck={false}
              value={notesData[player]}
              onChange={(e) =>
                setNotesData((n) => ({ ...n, [player]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

InvestigationSheet.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
};
