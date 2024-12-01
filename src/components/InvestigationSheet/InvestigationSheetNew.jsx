import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import GridCell from "./GridCell";
import styles from "./InvestigationSheet.module.css";

import { getString } from "../../utils/helpers";
import { COLORS, COUNTS, WEAPONS } from "../../config/constants";
import { initGridCells, initTally } from "../../utils/gameInits";
// import Notes from "../Notes";

export default function InvestigationSheetNew({ players }) {
  const ss_sheetData = sessionStorage.getItem("sheetData");
  // const isShortScreen = window.innerHeight < 680;

  var [cellKey, setCellKey] = useState(() => {
    return ss_sheetData ? JSON.parse(ss_sheetData).cellKey : null;
  });
  var [cellIdx, setCellIdx] = useState(() => {
    return ss_sheetData ? JSON.parse(ss_sheetData).cellIdx : null;
  });

  const [gridCells, setGridCells] = useState(() => {
    return ss_sheetData
      ? JSON.parse(ss_sheetData).gridCells
      : initGridCells(players);
  });
  const [commonCount, setCommonCount] = useState(() => {
    return ss_sheetData ? JSON.parse(ss_sheetData).commonCount : 0;
  });
  const [tally, setTally] = useState(() => {
    return ss_sheetData ? JSON.parse(ss_sheetData).tally : initTally(players);
  });

  useEffect(() => {
    console.log("sheet render");
  }, []);

  useEffect(() => {
    const dataToStore = {
      cellKey,
      cellIdx,
      gridCells,
      commonCount,
      tally,
    };
    sessionStorage.setItem("sheetData", JSON.stringify(dataToStore));
  }, [cellKey, cellIdx, gridCells, commonCount, tally]);

  // helper functions

  const resetSheet = () => {
    // sessionStorage.removeItem("investigationSheetData");
    setCellKey(null);
    setCellIdx(null);
    setGridCells(() => initGridCells(players));
    setCommonCount(0);
    setTally(() => initTally(players));
  };

  // Cell
  const handleBoxClick = (newKey, newIdx) => {
    if (cellIdx !== null) {
      setGridCells((b) => ({
        ...b,
        [cellKey]: { ...b[cellKey], focus: 0 },
      }));
    }
    setGridCells((b) => ({
      ...b,
      [newKey]: { ...b[newKey], focus: newIdx },
    }));
    setCellKey(newKey);
    setCellIdx(newIdx);
  };

  const handlePlayerClick = (player) => {
    const valKey = "valsB" + cellIdx;
    if (
      cellIdx !== null &&
      !gridCells[cellKey].common &&
      !gridCells[cellKey].marked
    ) {
      setGridCells((b) => ({
        ...b,
        [cellKey]: {
          ...b[cellKey],
          [valKey]: {
            ...b[cellKey][valKey],
            [player]: !b[cellKey][valKey][player],
          },
        },
      }));
    }
  };
  const handlePlayerCrossClick = (player) => {
    if (cellIdx !== null && !gridCells[cellKey].common) {
      if (!gridCells[cellKey].marked) {
        setTally((p) => ({ ...p, [player]: p[player] + 1 }));
        setGridCells((b) => ({
          ...b,
          [cellKey]: { ...b[cellKey], marked: true, label: player },
        }));
      } else {
        const label = gridCells[cellKey].label;
        if (label === player) {
          setTally((p) => ({
            ...p,
            [player]: p[player] === 0 ? 0 : p[player] - 1,
          }));
          setGridCells((b) => ({
            ...b,
            [cellKey]: { ...b[cellKey], marked: false, label: "" },
          }));
        } else {
          setTally((p) => ({
            ...p,
            [label]: p[label] === 0 ? 0 : p[label] - 1,
            [player]: p[player] + 1,
          }));
          setGridCells((b) => ({
            ...b,
            [cellKey]: { ...b[cellKey], marked: true, label: player },
          }));
        }
      }
    }
  };
  const handleCommonClick = () => {
    if (cellIdx !== null) {
      if (!gridCells[cellKey].common) {
        setCommonCount((c) => c + 1);
        if (gridCells[cellKey].marked) {
          const label = gridCells[cellKey].label;
          setTally((p) => ({
            ...p,
            [label]: p[label] === 0 ? 0 : p[label] - 1,
          }));
          setGridCells((b) => ({
            ...b,
            [cellKey]: {
              ...b[cellKey],
              common: true,
              marked: false,
              label: "",
            },
          }));
        } else {
          setGridCells((b) => ({
            ...b,
            [cellKey]: { ...b[cellKey], common: true },
          }));
        }
      } else {
        setCommonCount((c) => c - 1);
        setGridCells((b) => ({
          ...b,
          [cellKey]: { ...b[cellKey], common: false },
        }));
      }
    }
  };
  const handleClearClick = () => {
    if (
      cellIdx !== null &&
      !gridCells[cellKey].common &&
      !gridCells[cellKey].marked
    ) {
      setGridCells((b) => ({
        ...b,
        [cellKey]: {
          ...b[cellKey],
          valsB1: Object.fromEntries(players.map((key) => [key, false])),
          valsB2: Object.fromEntries(players.map((key) => [key, false])),
        },
      }));
    }
  };
  const handleResetClick = () => {
    const userResponse = confirm("You are about to wipe all data. Proceed?");
    if (userResponse) {
      resetSheet();
    }
  };

  // UI renders
  const getcountRow = (weapon, count) => (
    <div className={styles.countRow} key={weapon + count}>
      <div className={styles.countHeader}>
        {getString(weapon).repeat(count)}
      </div>

      {COLORS.map((color) => {
        const cellKey = weapon + count + color;
        return (
          <GridCell
            key={cellKey}
            feature={gridCells[cellKey]}
            onBoxClick={handleBoxClick}
          />
        );
      })}
    </div>
  );
  const getWeaponGrid = (weapon) => (
    <div className={styles.weaponGrid} key={weapon}>
      <div className={styles.weaponHeader}>
        {weapon} ({getString(weapon)})
      </div>
      {COUNTS.map((count) => getcountRow(weapon, count))}
    </div>
  );

  return (
    // <div className={styles.outerContainer}>
    // <div className={styles.header}>Investigation Sheet</div>
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {WEAPONS.map((weapon) => getWeaponGrid(weapon))}
      </div>

      {/* Button Panel */}
      <div className={styles.buttonContainer}>
        <div className={styles.buttonRow}>
          {players.map((player) => (
            <div key={"button-" + player} className={styles.topBtn}>
              <div
                className={`${styles.topBtnL} ${
                  cellIdx &&
                  (gridCells[cellKey].label === player ||
                    (!(
                      gridCells[cellKey].marked || gridCells[cellKey].common
                    ) &&
                      (gridCells[cellKey].valsB1[player] ||
                        gridCells[cellKey].valsB2[player])))
                    ? styles.btnGreenBg
                    : styles.btnGrayBg
                }`}
                onClick={() => handlePlayerClick(player)}
              >
                {player}
              </div>
              <div
                className={`${styles.topBtnR} ${
                  cellIdx &&
                  (gridCells[cellKey].label === player ||
                    (!(
                      gridCells[cellKey].marked || gridCells[cellKey].common
                    ) &&
                      (gridCells[cellKey].valsB1[player] ||
                        gridCells[cellKey].valsB2[player])))
                    ? styles.btnGreenBg
                    : styles.btnGrayBg
                }`}
                onClick={() => handlePlayerCrossClick(player)}
              >
                X : {tally[player]}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonRow}>
          <div
            className={styles.lowerBtn}
            // style={{ backgroundColor: "brown" }}
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
            // style={{ backgroundColor: "red" }}
          >
            RESET
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
InvestigationSheetNew.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
};
