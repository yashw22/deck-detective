import { useCallback, useEffect, useState } from "react";
import {
  colorElements,
  typeElements,
  weaponElements,
} from "../../lib/constants";
import { getCardWeaponIcon, getPlayers } from "../../lib/utils";
import styles from "./InvestigationSheet.module.css";
import InvestigationSheetTextArea from "./InvestigationSheetTextArea";

const initBoxFeatureMap = () => {
  const features = {};
  weaponElements.forEach((weapon) => {
    typeElements.forEach((type) => {
      colorElements.forEach((color) => {
        features[weapon + "-" + type + "-" + color] = {
          weapon: weapon,
          type: type,
          color: color,
          contentBox1: [],
          contentBox2: [],
          focusBox1: false,
          focusBox2: false,
          markBox: false,
          playerLabel: "",
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

export default function InvestigationSheet() {
  const players = getPlayers();

  var [boxKey, setBoxKey] = useState(
    weaponElements[0] + "-" + typeElements[0] + "-" + colorElements[0]
  );
  var [boxIdx, setBoxIdx] = useState(0);
  const [boxFeatureMap, setBoxFeatureMap] = useState(initBoxFeatureMap());
  const [playerTally, setPlayerTally] = useState(initPlayerTally(players));
  const [notesData, setNotesData] = useState(initPlayerNotes(players));

  useEffect(() => {
    const local_boxFeatureMap = localStorage.getItem(
      "investigationSheet_boxFeatureMap"
    );
    if (local_boxFeatureMap) setBoxFeatureMap(JSON.parse(local_boxFeatureMap));
    const local_playerTally = localStorage.getItem(
      "investigationSheet_playerTally"
    );
    if (local_playerTally) setPlayerTally(JSON.parse(local_playerTally));
    const local_notesData = localStorage.getItem(
      "investigationSheet_notesData"
    );
    if (local_notesData) setNotesData(JSON.parse(local_notesData));
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "investigationSheet_boxFeatureMap",
      JSON.stringify(boxFeatureMap)
    );
  }, [boxFeatureMap]);
  useEffect(() => {
    localStorage.setItem(
      "investigationSheet_playerTally",
      JSON.stringify(playerTally)
    );
  }, [playerTally]);
  useEffect(() => {
    localStorage.setItem(
      "investigationSheet_notesData",
      JSON.stringify(notesData)
    );
  }, [notesData]);

  const handleBoxBtn = useCallback(
    (newBoxKey, newBoxIdx) => {
      if (boxIdx !== 0) {
        setBoxFeatureMap((b) => ({
          ...b,
          [boxKey]: { ...b[boxKey], ["focusBox" + boxIdx]: false },
        }));
      }
      setBoxFeatureMap((b) => ({
        ...b,
        [newBoxKey]: { ...b[newBoxKey], ["focusBox" + newBoxIdx]: true },
      }));
      setBoxKey(newBoxKey);
      setBoxIdx(newBoxIdx);
    },
    [boxKey, boxIdx]
  );
  const handlePlayerBtn = (player) => {
    const contentKey = "contentBox" + boxIdx;
    if (boxIdx !== 0 && !boxFeatureMap[boxKey][contentKey].includes(player)) {
      setBoxFeatureMap((b) => ({
        ...b,
        [boxKey]: {
          ...b[boxKey],
          [contentKey]: [...b[boxKey][contentKey], player],
        },
      }));
    }
  };
  const handleBackBtn = () => {
    const contentKey = "contentBox" + boxIdx;
    if (boxIdx !== 0 && boxFeatureMap[boxKey][contentKey].len !== 0) {
      setBoxFeatureMap((b) => {
        const contentList = [...b[boxKey][contentKey]];
        contentList.pop();
        return {
          ...b,
          [boxKey]: {
            ...b[boxKey],
            [contentKey]: contentList,
          },
        };
      });
    }
  };
  const handleClearBtn = () => {
    if (boxIdx !== 0) {
      setBoxFeatureMap((b) => ({
        ...b,
        [boxKey]: {
          ...b[boxKey],
          contentBox1: [],
          contentBox2: [],
        },
      }));
    }
  };
  const handleCrossBtn = () => {
    if (boxIdx !== 0) {
      setBoxFeatureMap((b) => ({
        ...b,
        [boxKey]: { ...b[boxKey], markBox: !b[boxKey].markBox },
      }));
    }
  };
  const handleResetBtn = () => {
    const userResponse = confirm("You are about to wipe all data. Proceed?");
    if (userResponse) {
      setBoxKey(
        weaponElements[0] + "-" + typeElements[0] + "-" + colorElements[0]
      );
      setBoxIdx(0);
      setBoxFeatureMap(initBoxFeatureMap());
      setPlayerTally(initPlayerTally(players));
      setNotesData(initPlayerNotes(players));
    }
  };

  const handleIncrementBtn = (player) => {
    setPlayerTally((p) => ({ ...p, [player]: p[player] + 1 }));
  };
  const handleDecrementBtn = (player) => {
    if (playerTally[player] !== 0) {
      setPlayerTally((p) => ({ ...p, [player]: p[player] - 1 }));
    }
  };

  const getTypeRow = (weapon, type) => (
    <div className={styles.typeRow} key={weapon + "-" + type + "-box"}>
      <div className={styles.typeHeader}>
        {getCardWeaponIcon(weapon).repeat(type)}
      </div>

      {colorElements.map((color) => {
        const boxKey = weapon + "-" + type + "-" + color;
        return (
          <InvestigationSheetTextArea
            key={boxKey + "-box"}
            features={boxFeatureMap[boxKey]}
            onBoxClick={handleBoxBtn}
          />
        );
      })}
    </div>
  );
  const getWeaponGrid = (weapon) => (
    <div className={styles.weaponGrid} key={weapon + "-box"}>
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

      <div>
        <div className={styles.buttonContainer}>
          {players.map((player) => (
            <div
              key={"button-" + player}
              onClick={() => handlePlayerBtn(player)}
            >
              {player}
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <div onClick={handleBackBtn}>back</div>
          <div onClick={handleClearBtn}>clear</div>
          <div onClick={handleCrossBtn}>cross</div>
          <div onClick={handleResetBtn} style={{ backgroundColor: "red" }}>
            RESET
          </div>
        </div>
      </div>

      <div className={styles.notesAreaContainer}>
        {players.map((player) => (
          <div key={"notes-" + player} className={styles.notesRowContainer}>
            <div className={styles.playerTallyGroup}>
              <div className={styles.playerTallyContents}>
                <div>{player}</div>:<div>{playerTally[player]}</div>
              </div>
              <div className={styles.playerTallyBtns}>
                <div onClick={() => handleDecrementBtn(player)}>-</div>
                <div onClick={() => handleIncrementBtn(player)}>+</div>
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
