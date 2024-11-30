import PropTypes from "prop-types";
import styles from "./SearchCard.module.css";

import { getHex, getString } from "../../utils/helpers";
import { COUNTS, FREE_ICON, WEAPONS } from "../../config/constants";

export default function SearchCard({ card }) {
  const { weapon, count, color, free } = card;
  const cardColor = color ? getHex(color) : "whitesmoke";
  const cardIcon = getString(weapon);

  const getRow = (icon, count) => {
    return <div className={styles.iconRow}>{icon.repeat(count)}</div>;
  };

  const buildCardCenter = () => {
    if (weapon && count) {
      return <span key={weapon}>{getRow(cardIcon, count)}</span>;
    }
    if (weapon)
      return Array.from(COUNTS, (type) => (
        <span key={type}>{getRow(cardIcon, type)}</span>
      ));
    if (count)
      return Array.from(WEAPONS, (weapon) => (
        <span key={weapon}>{getRow(getString(weapon), count)}</span>
      ));
    return "";
  };

  return (
    <div className={styles.cardBody} style={{ backgroundColor: cardColor }}>
      <div className={styles.header}>🕵️</div>

      <div className={styles.iconContainer}>
        {free && <div className={styles.freeIcon}>{FREE_ICON}</div>}
        {buildCardCenter()}
      </div>

      <div className={styles.footer}>
        {free && <div>Free Choice:{FREE_ICON}</div>}
        {color && <div>{getString(color)}</div>}
        {weapon && <div>{weapon}</div>}
        {count && <div>{getString(count)}</div>}
      </div>
    </div>
  );
}
SearchCard.propTypes = {
  card: PropTypes.shape({
    elementsCount: PropTypes.number.isRequired,
    weapon: PropTypes.string,
    count: PropTypes.number,
    color: PropTypes.string,
    free: PropTypes.bool,
  }).isRequired,
};
