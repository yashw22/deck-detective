import PropTypes from "prop-types";

import styles from "./Notes.module.css";
import { useEffect, useState } from "react";
import { initNotes } from "../utils/gameInits";

export default function Notes({ players }) {
  const [ss_notesData, setss_notesData] = useState(() => {
    const ss_notesData = sessionStorage.getItem("ss_notesData");
    return ss_notesData ? JSON.parse(ss_notesData) : initNotes(players);
  });

  useEffect(() => {
    sessionStorage.setItem("ss_notesData", JSON.stringify(ss_notesData));
  }, [ss_notesData]);

  return (
    <div className={styles.container}>
      {players.map((player) => (
        <div key={"notes-" + player} className={styles.row}>
          <div className={styles.player}>{player}</div>
          <textarea
            className={styles.notesArea}
            spellCheck={false}
            value={ss_notesData[player]}
            onChange={(e) =>
              setss_notesData((n) => ({ ...n, [player]: e.target.value }))
            }
          />
        </div>
      ))}
    </div>
  );
}
Notes.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
};
