import { getCardColorHex, getCardWeaponIcon } from "../../lib/utils";
import styles from "./ElementCard.module.css";
import PropTypes from "prop-types";

export default function ElementCard({ card }) {
  let icon = getCardWeaponIcon(card.weapon);

  const renderIcons = () => {
    // Generate an array of icons based on `props.number`
    const icons = [];
    for (let i = 0; i < card.type; i++) {
      icons.push(
        <span key={i} className={styles.icon}>
          {icon}
        </span>
      );
    }
    return (
      <div className={card.type === 3 ? styles.diagonal : styles.icons}>
        {icons}
      </div>
    );
  };

  return (
    <div
      className={styles.cardBody}
      style={{ backgroundColor: getCardColorHex(card.color) }}
    >
      {renderIcons()}
    </div>
  );
}

ElementCard.propTypes = {
  card: PropTypes.shape({
    weapon: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};
