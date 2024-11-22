import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import PropTypes from "prop-types";
import styles from "./Notes.module.css";

const initPlayerTally = (players) => {
  const playerTally = {};
  players.forEach((player) => (playerTally[player] = 0));
  return playerTally;
};
const initPlayerNotes = (players) => {
  const playerNotes = {};
  players.forEach((player) => (playerNotes[player] = ""));
  return playerNotes;
};

const Notes = forwardRef(function Notes({ players }, ref) {
  const [playerTally, setPlayerTally] = useState(initPlayerTally(players));
  const [notesData, setNotesData] = useState(initPlayerNotes(players));

  useEffect(() => {
    const ss_playerTally = sessionStorage.getItem("isNotes_tally");
    if (ss_playerTally) setPlayerTally(JSON.parse(ss_playerTally));
    const ss_notesData = sessionStorage.getItem("isNotes_data");
    if (ss_notesData) setNotesData(JSON.parse(ss_notesData));
  }, []);
  useEffect(
    () => sessionStorage.setItem("isNotes_tally", JSON.stringify(playerTally)),
    [playerTally]
  );
  useEffect(
    () => sessionStorage.setItem("isNotes_data", JSON.stringify(notesData)),
    [notesData]
  );

  useImperativeHandle(ref, () => ({
    clearNotes: () => {
      setPlayerTally(initPlayerTally(players));
      setNotesData(initPlayerNotes(players));
    },
    modifyTally: (player, label) => {
      if (label === "") {
        setPlayerTally((p) => ({ ...p, [player]: p[player] + 1 }));
      } else if (player !== label) {
        setPlayerTally((p) => ({
          ...p,
          [player]: p[player] + 1,
          [label]: p[label] - 1,
        }));
      }
    },
  }));

  const handleIncrementBtn = (player) => {
    setPlayerTally((p) => ({ ...p, [player]: p[player] + 1 }));
  };
  const handleDecrementBtn = (player) => {
    if (playerTally[player] !== 0) {
      setPlayerTally((p) => ({ ...p, [player]: p[player] - 1 }));
    }
  };

  return (
    <div className={styles.notesAreaContainer}>
      {players.map((player) => (
        <div key={"notes-" + player} className={styles.notesRowContainer}>
          <div className={styles.playerTallyGroup}>
            <div className={styles.playerTallyContents}>
              <div>{player}</div>:<div>{playerTally[player]}</div>
            </div>
            <div className={styles.playerTallyBtns}>
              <div onClick={() => handleDecrementBtn(player)}>-</div>
              <div onClick={() => handleIncrementBtn(player)}>+</div>
            </div>
          </div>
          <textarea
            className={styles.notesArea}
            spellCheck={false}
            value={notesData[player]}
            onChange={(e) =>
              setNotesData((n) => ({ ...n, [player]: e.target.value }))
            }
          />
        </div>
      ))}
    </div>
  );
});
Notes.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default memo(Notes);
