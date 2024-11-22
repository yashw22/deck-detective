import { memo, useEffect, useState } from "react";
import styles from "./ButtonPanel.module.css";
import PropTypes from "prop-types";

function ButtonPanel({ players, selectedBox, onButtonClick }) {
  const [commonCount, setCommonCount] = useState(0);

  useEffect(() => {
    const ls_commonCount = localStorage.getItem("is_commonCount");
    if (ls_commonCount) setCommonCount(JSON.parse(ls_commonCount));
  }, []);
  useEffect(() => {
    localStorage.setItem("is_commonCount", JSON.stringify(commonCount));
  }, [commonCount]);

  const handlBtnClick = (btnType, param) => {
    switch (btnType) {
      case "player":
        onButtonClick(btnType, param);
        break;
      case "playerXX":
        onButtonClick(btnType, param);
        break;
      case "common":
        if (selectedBox.common) setCommonCount((c) => c - 1);
        else setCommonCount((c) => c + 1);
        onButtonClick(btnType);
        break;
      case "clear":
        onButtonClick(btnType);
        break;
      case "reset":
        onButtonClick(btnType);
        break;
    }
  };

  return (
    <div>
      <div className={styles.buttonContainer}>
        {players.map((player) => (
          <div key={"button-" + player} className={styles.topBtn}>
            <div
              className={`${styles.topBtnL} ${
                selectedBox &&
                (selectedBox.label === player ||
                  (!(selectedBox.marked || selectedBox.common) &&
                    (selectedBox.valsB1[player] || selectedBox.valsB2[player])))
                  ? styles.btnGreenBg
                  : styles.btnGrayBg
              }`}
              onClick={() => handlBtnClick("player", player)}
            >
              {player}
            </div>
            <div
              className={`${styles.topBtnR} ${
                selectedBox &&
                (selectedBox.label === player ||
                  (!(selectedBox.marked || selectedBox.common) &&
                    (selectedBox.valsB1[player] || selectedBox.valsB2[player])))
                  ? styles.btnGreenBg
                  : styles.btnGrayBg
              }`}
              onClick={() => handlBtnClick("playerXX", player)}
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
          onClick={() => handlBtnClick("common")}
        >
          common: {commonCount}
        </div>
        <div className={styles.lowerBtn} onClick={() => handlBtnClick("clear")}>
          clear
        </div>

        <div
          className={styles.lowerBtn}
          onClick={() => onButtonClick("reset")}
          style={{ backgroundColor: "red" }}
        >
          RESET
        </div>
      </div>
    </div>
  );
}
ButtonPanel.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBox: PropTypes.shape({
    weapon: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    valsB1: PropTypes.object.isRequired,
    valsB2: PropTypes.object.isRequired,
    focusB1: PropTypes.bool.isRequired,
    focusB2: PropTypes.bool.isRequired,
    marked: PropTypes.bool.isRequired,
    common: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
  }),
  onButtonClick: PropTypes.func.isRequired,
};

export default memo(ButtonPanel);
