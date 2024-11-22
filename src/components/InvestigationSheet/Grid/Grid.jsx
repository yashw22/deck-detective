import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Grid.module.css";
import GridCell from "./GridCell";
import {
  colorElements,
  typeElements,
  weaponElements,
} from "../../../lib/constants";
import { getCardWeaponIcon } from "../../../lib/utils";

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

const Grid = forwardRef(function Grid({ players, getFeatureForBtns }, ref) {
  var [boxKey, setBoxKey] = useState(null);
  var [boxIdx, setBoxIdx] = useState(null);
  const [boxFeatures, setBoxFeatures] = useState(initBoxFeatures(players));

  useEffect(() => {
    const ss_boxFeatures = sessionStorage.getItem("is_boxFeatures");
    if (ss_boxFeatures) setBoxFeatures(JSON.parse(ss_boxFeatures));
  }, []);
  useEffect(() => {
    sessionStorage.setItem("is_boxFeatures", JSON.stringify(boxFeatures));
  }, [boxFeatures]);

  useImperativeHandle(ref, () => ({
    handlePlayerBtn: (player) => {
      const valKey = "valsB" + boxIdx;
      if (boxIdx !== null) {
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
    },
    handlePlayerXXBtn: (player) => {
      if (boxIdx !== null) {
        if (boxFeatures[boxKey].label !== player) {
          setBoxFeatures((b) => {
            return {
              ...b,
              [boxKey]: { ...b[boxKey], marked: true, label: player },
            };
          });
        } else {
          setBoxFeatures((b) => {
            return {
              ...b,
              [boxKey]: { ...b[boxKey], marked: false, label: "" },
            };
          });
        }
      }
    },
    handleCommonBtn: () => {
      if (boxIdx !== null) {
        setBoxFeatures((b) => ({
          ...b,
          [boxKey]: { ...b[boxKey], common: !b[boxKey].common },
        }));
      }
    },
    handleClearBtn: () => {
      if (boxIdx !== null) {
        setBoxFeatures((b) => ({
          ...b,
          [boxKey]: {
            ...b[boxKey],
            valsB1: Object.fromEntries(players.map((key) => [key, false])),
            valsB2: Object.fromEntries(players.map((key) => [key, false])),
          },
        }));
      }
    },
    handleResetBtn: () => {
      const userResponse = confirm("You are about to wipe all data. Proceed?");
      if (userResponse) {
        setBoxKey(null);
        setBoxIdx(null);
        setBoxFeatures(initBoxFeatures(players));
      }
    },
  }));

  const handleBoxClick = (newBoxKey, newBoxIdx) => {
    getFeatureForBtns(boxFeatures[newBoxKey]);
    if (boxIdx !== null) {
      setBoxFeatures((b) => ({
        ...b,
        [boxKey]: { ...b[boxKey], ["focusB" + boxIdx]: false },
      }));
    }
    setBoxFeatures((b) => ({
      ...b,
      [newBoxKey]: { ...b[newBoxKey], ["focusB" + newBoxIdx]: true },
    }));
    setBoxKey(newBoxKey);
    setBoxIdx(newBoxIdx);
  };

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
    <div id="gridContainer" className={styles.gridContainer}>
      {weaponElements.map((weapon) => getWeaponGrid(weapon))}
    </div>
  );
});
Grid.propTypes = {
  getFeatureForBtns: PropTypes.func.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Grid;
