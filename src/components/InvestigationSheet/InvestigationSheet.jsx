import { useState, useRef } from "react";
import PropTypes from "prop-types";
// import {
//   colorElements,
//   typeElements,
//   weaponElements,
// } from "../../lib/constants";
import Grid from "./Grid/Grid";
import ButtonPanel from "./ButtonPanel/ButtonPanel";
import Notes from "./Notes/Notes";
import styles from "./InvestigationSheet.module.css";

export default function InvestigationSheet({ players }) {
  const notesRef = useRef();
  const gridRef = useRef();
  var [selectedBox, setSelectedBox] = useState(null);

  const handleButtonClick = (btnType, param) => {
    switch (btnType) {
      case "player":
        gridRef.current.handlePlayerBtn(param);
        break;
      case "playerXX":
        gridRef.current.handlePlayerXXBtn(param);
        notesRef.current.modifyTally(param, selectedBox.label);
        break;
      case "common":
        gridRef.current.handleCommonBtn();
        break;
      case "clear":
        gridRef.current.handleClearBtn();
        break;
      case "reset":
        gridRef.current.handleResetBtn();
        notesRef.current.clearNotes();
        break;
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.header}>Investigation Sheet</div>

      <Grid
        ref={gridRef}
        players={players}
        getFeatureForBtns={setSelectedBox}
      />
      <ButtonPanel
        players={players}
        selectedBox={selectedBox}
        onButtonClick={handleButtonClick}
      />
      <Notes ref={notesRef} players={players} />
    </div>
  );
}
InvestigationSheet.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
};
