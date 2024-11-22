import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./GridCell.module.css";
import { getCardColorHex, lightenColor } from "../../../lib/utils";
import { textColorForColorBg } from "../../../lib/constants";

function GridCell({ feature, onBoxClick }) {
  const boxKey = feature.weapon + feature.type + feature.color;

  const topBoxStyle = {
    backgroundColor: getCardColorHex(feature.color),
    color: textColorForColorBg,
    outline: feature.focusB1 ? "3px solid white" : "none",
  };
  const bottomBoxStyle = {
    backgroundColor: getCardColorHex(feature.color),
    color: textColorForColorBg,
    outline: feature.focusB2 ? "3px solid white" : "none",
  };

  if (feature.common)
    return (
      <div
        className={styles.commonContainer}
        style={{ outline: feature.focusB1 ? "3px solid white" : "" }}
        onClick={() => onBoxClick(boxKey, 1)}
      ></div>
    );

  if (feature.marked)
    return (
      <div
        className={styles.markedContainer}
        style={{
          backgroundColor: lightenColor(feature.color, 70),
          outline: feature.focusB1 ? "3px solid white" : "",
        }}
        onClick={() => onBoxClick(boxKey, 1)}
      >
        {feature.label}
      </div>
    );

  return (
    <div className={styles.boxContainer}>
      <div
        className={styles.box}
        style={topBoxStyle}
        onClick={() => onBoxClick(boxKey, 1)}
      >
        {Object.keys(feature.valsB1)
          .filter((key) => feature.valsB1[key])
          .join(" ")}
      </div>
      <div
        className={styles.box}
        style={bottomBoxStyle}
        onClick={() => onBoxClick(boxKey, 2)}
      >
        {Object.keys(feature.valsB2)
          .filter((key) => feature.valsB2[key])
          .join(" ")}
      </div>
    </div>
  );
}

GridCell.propTypes = {
  feature: PropTypes.shape({
    weapon: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    valsB1: PropTypes.object.isRequired,
    valsB2: PropTypes.object.isRequired,
    focusB0: PropTypes.bool.isRequired,
    focusB1: PropTypes.bool.isRequired,
    focusB2: PropTypes.bool.isRequired,
    marked: PropTypes.bool.isRequired,
    common: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onBoxClick: PropTypes.func,
};

export default memo(GridCell);
