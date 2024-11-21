import PropTypes from "prop-types";
import { getCardColorHex } from "../../lib/utils";
import { textColorForColorBg } from "../../lib/constants";
import styles from "./InvestigationSheetTextArea.module.css";

export default function InvestigationSheetTextArea({ features, onBoxClick }) {
  const boxKey = features.weapon + "-" + features.type + "-" + features.color;

  // useEffect(() => {
  //   console.log("Rendering box: ", boxKey);
  // });

  var topBoxStyle = {
    backgroundColor: features.focusBox1
      ? "gray"
      : getCardColorHex(features.color),
    color: textColorForColorBg,
    borderBottom: "0.5px solid white",
  };
  var bottomBoxStyle = {
    backgroundColor: features.focusBox2
      ? "gray"
      : getCardColorHex(features.color),
    color: textColorForColorBg,
  };
  return (
    <div
      className={`${styles.boxContainer} ${
        features.markBox ? styles.markContainer : ""
      }`}
    >
      <div
        className={styles.box}
        style={topBoxStyle}
        onClick={() => onBoxClick(boxKey, 1)}
      >
        {features.contentBox1.join(" ")}
      </div>
      <div
        className={styles.box}
        style={bottomBoxStyle}
        onClick={() => onBoxClick(boxKey, 2)}
      >
        {features.contentBox2.join(" ")}
      </div>
    </div>
  );
}

InvestigationSheetTextArea.propTypes = {
  features: PropTypes.shape({
    weapon: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    contentBox1: PropTypes.arrayOf(PropTypes.string).isRequired,
    contentBox2: PropTypes.arrayOf(PropTypes.string).isRequired,
    focusBox1: PropTypes.bool.isRequired,
    focusBox2: PropTypes.bool.isRequired,
    markBox: PropTypes.bool.isRequired,
  }).isRequired,
  onBoxClick: PropTypes.func,
};
