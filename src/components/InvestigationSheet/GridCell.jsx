import { memo } from "react";
import PropTypes from "prop-types";
import styles from "./GridCell.module.css";
import { getHex } from "../../utils/helpers";

function GridCell({ feature, onBoxClick }) {
  const { weapon, count, color, valsB1, valsB2, focus, marked, common, label } =
    feature;
  const boxKey = weapon + count + color;

  // outline: focus ? "3px solid blue" : "",

  if (common)
    return (
      <div
        className={styles.commonContainer}
        style={{ backgroundColor: focus === 1 ? "gray" : getHex(color) }}
        onClick={() => onBoxClick(boxKey, 1)}
      ></div>
    );

  if (marked)
    return (
      <div
        className={`${styles.markedContainer} ${styles.commonContainer}`}
        style={{ backgroundColor: focus === 1 ? "gray" : getHex(color) }}
        onClick={() => onBoxClick(boxKey, 1)}
      >
        <span>{label}</span>
      </div>
    );

  return (
    <div className={styles.boxContainer}>
      <>
        <div
          className={styles.box}
          style={{ backgroundColor: focus === 1 ? "gray" : getHex(color) }}
          onClick={() => onBoxClick(boxKey, 1)}
        >
          {Object.keys(valsB1)
            .filter((key) => valsB1[key])
            .join(" ")}
        </div>
        <div
          className={styles.box}
          style={{ backgroundColor: focus === 2 ? "gray" : getHex(color) }}
          onClick={() => onBoxClick(boxKey, 2)}
        >
          {Object.keys(valsB2)
            .filter((key) => valsB2[key])
            .join(" ")}
        </div>
      </>
    </div>
  );
}

GridCell.propTypes = {
  feature: PropTypes.shape({
    weapon: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    valsB1: PropTypes.object.isRequired,
    valsB2: PropTypes.object.isRequired,
    focus: PropTypes.number.isRequired,
    marked: PropTypes.bool.isRequired,
    common: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onBoxClick: PropTypes.func,
};

export default memo(GridCell);
