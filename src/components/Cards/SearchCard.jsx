import { getCardColorHex, getCardWeaponIcon } from "../../lib/utils";
import styles from "./SearchCard.module.css";
import PropTypes from "prop-types";

export default function SearchCard({ card }) {
  const icon = getCardWeaponIcon(card.weapon);
  const displayProperty = () => {
    console.log(card)
  }

  const renderIcons = (repeatnum=0) => {
    // Generate an array of icons based on `elementsCount`
    const icons = [];
    let num = card.type
    if (!card.type && (card.weapon||card.free)) num=1
    for (let i = 0; i < num; i++) {
      icons.push(
        <span key={i} className={styles.icon}>
          {icon}
        </span>
      );
    }
    return (
      <div className={styles.icons}>
        <span key={3} className={styles.icon}>
          {icons}{card.weapon && card.free && "❓"}
        </span>
      </div>
    );
  };

  const caseRenderIcons = (repeatnum=0) => {
    // Generate an array of icons based on `elementsCount`
    const icons = [];
    if(card.weapon){
      icons.push(
        <span className={styles.icon}>
          {icon}
        </span>
      );
      icons.push(
        <span className={styles.icon}>
          {icon}{icon}
        </span>
      );
      icons.push(
        <span className={styles.icon}>
          {icon}{icon}{icon}
        </span>
      );
    }
    else {
      
      icons.push(
        <span className={styles.icon}>
          {getCardWeaponIcon(card.weapon?card.weapon:"Axe")}{card.type>1 && getCardWeaponIcon(card.weapon?card.weapon:"Axe")}{card.type>2 && getCardWeaponIcon(card.weapon?card.weapon:"Axe")}
        </span>
      );
      icons.push(
        <span className={styles.icon}>
          {getCardWeaponIcon(card.weapon?card.weapon:"Blaster")}{card.type>1 && getCardWeaponIcon(card.weapon?card.weapon:"Blaster")}{card.type>2 && getCardWeaponIcon(card.weapon?card.weapon:"Blaster")}
        </span>
      );
      icons.push(
        <span className={styles.icon}>
          {getCardWeaponIcon(card.weapon?card.weapon:"Crossbow")}{card.type>1 && getCardWeaponIcon(card.weapon?card.weapon:"Crossbow")}{card.type>2 && getCardWeaponIcon(card.weapon?card.weapon:"Crossbow")}
        </span>
      );
    }
    return (
      <div className={styles.icons}>
        {icons}
      </div>
    );
  };

  let type = card.type == 1 ? "Single" : card.type == 2 ? "Double" : "Triple";
  return (
    <div
      className={styles.cardBody}
      style={{ backgroundColor: card.color ? getCardColorHex(card.color) : "whitesmoke" }}
      onClick={displayProperty}
    >
      <div className={styles.cardHeader}>
      🕵️
      </div>
      {(card.elementsCount == 1 && (card.weapon||card.type)||(card.elementsCount==2 && card.type && card.color )) ? caseRenderIcons():renderIcons()}
      <div className={styles.cardHeader}>
        {card.color &&<div className={styles.type}>{card.color.charAt(0).toUpperCase() + card.color.slice(1)}</div>}
        {card.weapon && <div className={styles.weapon}>{card.weapon}</div>}
        {card.type && <div className={styles.type}>{type}</div>}
      </div>
      {card.free && <div className={styles.freeBadge}>Free</div>}
    </div>
  );
}

SearchCard.propTypes = {
  card: PropTypes.shape({
    elementsCount: PropTypes.number.isRequired,
    weapon: PropTypes.string,
    type: PropTypes.number,
    color: PropTypes.string,
    free: PropTypes.bool,
  }).isRequired,
};
