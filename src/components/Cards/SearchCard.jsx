import PropTypes from "prop-types";
import styles from "./SearchCard.module.css";

import { getColorHex, getWeaponIcon } from "../../lib/utils";
import {
  colorStr,
  freeIcon,
  typeElements,
  typeStr,
  weaponElements,
} from "../../lib/gameConstants";

export default function SearchCard({ card }) {
  const cardColor = card.color ? getColorHex(card.color) : "whitesmoke";
  const cardIcon = getWeaponIcon(card.weapon);

  // const renderIcons = () => {
  //   // Generate an array of icons based on `elementsCount`
  //   const icons = [];
  //   let num = card.type;
  //   if (!card.type && (card.weapon || card.free)) num = 1;
  //   for (let i = 0; i < num; i++) {
  //     icons.push(
  //       <span key={i} className={styles.icon}>
  //         {cardIcon}
  //       </span>
  //     );
  //   }
  //   return (
  //     <div className={styles.icons}>
  //       <span key={3} className={styles.icon}>
  //         {icons}
  //         {card.weapon && card.free && "❓"}
  //       </span>
  //     </div>
  //   );
  // };

  // const caseRenderIcons = () => {
  //   // console.log(card);
  //   // Generate an array of icons based on `elementsCount`
  //   const icons = [];
  //   if (card.weapon) {
  //     icons.push(
  //       <span key={1} className={styles.icon}>
  //         {cardIcon}
  //       </span>
  //     );
  //     icons.push(
  //       <span key={2} className={styles.icon}>
  //         {cardIcon}
  //         {cardIcon}
  //       </span>
  //     );
  //     icons.push(
  //       <span key={3} className={styles.icon}>
  //         {cardIcon}
  //         {cardIcon}
  //         {cardIcon}
  //       </span>
  //     );
  //   } else {
  //     icons.push(
  //       <span key={1} className={styles.icon}>
  //         {getWeaponIcon(card.weapon ? card.weapon : "Axe")}
  //         {card.type > 1 && getWeaponIcon(card.weapon ? card.weapon : "Axe")}
  //         {card.type > 2 && getWeaponIcon(card.weapon ? card.weapon : "Axe")}
  //       </span>
  //     );
  //     icons.push(
  //       <span key={2} className={styles.icon}>
  //         {getWeaponIcon(card.weapon ? card.weapon : "Blaster")}
  //         {card.type > 1 &&
  //           getWeaponIcon(card.weapon ? card.weapon : "Blaster")}
  //         {card.type > 2 &&
  //           getWeaponIcon(card.weapon ? card.weapon : "Blaster")}
  //       </span>
  //     );
  //     icons.push(
  //       <span key={3} className={styles.icon}>
  //         {getWeaponIcon(card.weapon ? card.weapon : "Crossbow")}
  //         {card.type > 1 &&
  //           getWeaponIcon(card.weapon ? card.weapon : "Crossbow")}
  //         {card.type > 2 &&
  //           getWeaponIcon(card.weapon ? card.weapon : "Crossbow")}
  //       </span>
  //     );
  //   }
  //   return <div className={styles.icons}>{icons}</div>;
  // };

  const getRow = (icon, count) => {
    return <div className={styles.iconRow}>{icon.repeat(count)}</div>;
  };

  const buildCardCenter = () => {
    if (card.weapon && card.type) {
      return <span key={card.weapon}>{getRow(cardIcon, card.type)}</span>;
    }
    if (card.weapon)
      return Array.from(typeElements, (type) => (
        <span key={type}>{getRow(cardIcon, type)}</span>
      ));
    if (card.type)
      return Array.from(weaponElements, (weapon) => (
        <span key={weapon}>{getRow(getWeaponIcon(weapon), card.type)}</span>
      ));
    return "";
  };

  // const getFreeBgColor = () => (
  //   <>
  //     <div
  //       className={styles.bgR}
  //       style={{ backgroundColor: getColorHex("red") }}
  //     ></div>
  //     <div
  //       className={styles.bgG}
  //       style={{ backgroundColor: getColorHex("green") }}
  //     ></div>
  //     <div
  //       className={styles.bgB}
  //       style={{ backgroundColor: getColorHex("blue") }}
  //     ></div>
  //     <div
  //       className={styles.bgY}
  //       style={{ backgroundColor: getColorHex("yellow") }}
  //     ></div>
  //   </>
  // );

  return (
    <div
      className={styles.cardBody}
      style={{ backgroundColor: cardColor }}
      // onClick={() => console.log(card)}
    >
      {/* <div className={styles.header}>🕵️</div> */}

      {/* {(card.elementsCount === 1 && (card.weapon || card.type)) ||
      (card.elementsCount === 2 && card.type && card.color)
      ? caseRenderIcons()
      : renderIcons()} */}

      {/* <div className={styles.header}>
        {card.free && <div className={styles.str}>Free Choice</div>}
        {card.color && <div className={styles.str}>{colorStr[card.color]}</div>}
        {card.weapon && <div className={styles.str}>{card.weapon}</div>}
        {card.type && <div className={styles.str}>{typeStr[card.type]}</div>}
      </div> */}

      <div className={styles.header}>🕵️</div>
      {/* {card.free && !card.color && getFreeBgColor()} */}

      {/* <div className={styles.centerContainer}> */}

      <div className={styles.iconContainer}>
        {card.free && <div className={styles.freeIcon}>{freeIcon}</div>}
        {buildCardCenter()}
      </div>
      {/* </div> */}

      <div className={styles.footer}>
        {card.free && (
          <div>
            {/* Free Choice:{<span className={styles.free}>{freeIcon}</span>} */}
            Free Choice: {freeIcon}
          </div>
        )}
        {card.color && <div>{colorStr[card.color]}</div>}
        {card.weapon && <div>{card.weapon}</div>}
        {card.type && <div>{typeStr[card.type]}</div>}
      </div>
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
