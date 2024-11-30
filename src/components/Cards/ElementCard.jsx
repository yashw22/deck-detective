import PropTypes from "prop-types";
import styles from "./ElementCard.module.css";

import { getHex, getString } from "../../utils/helpers";

export default function ElementCard({ card }) {
  const { weapon, count, color } = card;
  let icon = getString(weapon);

  const renderIcons = () => {
    const icons = [];
    for (let i = 0; i < count; i++) icons.push(<span key={i}>{icon}</span>);

    return (
      <div className={count === 3 ? styles.diagonal : styles.icons}>
        {icons}
      </div>
    );
  };

  return (
    <div className={styles.cardBody} style={{ backgroundColor: getHex(color) }}>
      {renderIcons()}
    </div>
  );
}

ElementCard.propTypes = {
  card: PropTypes.shape({
    weapon: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};
