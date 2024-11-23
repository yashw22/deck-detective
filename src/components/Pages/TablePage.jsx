import React from 'react';
import styles from './TablePage.module.css';

const TablePage = ({ detectiveName = 'You', players = ["Mehvish"] }) => {
  // Ensure the detective is P1 at the bottom
  const playerList = [detectiveName, ...players];

  // Calculate player positions dynamically
  const getPlayerPosition = (index, totalPlayers) => {
    // Place the first player (P1) at the bottom
    if (index === 0) {
      return { transform: `translate(-50%, 120px)` }; // Adjust for bottom position
    }

    // Position other players evenly around the circle
    const angle = ((index - 1) / (totalPlayers - 1)) * Math.PI; // Angles between 0 and π
    const x = 120 * Math.cos(angle); // X coordinate
    const y = -120 * Math.sin(angle); // Y coordinate (negative for top half)
    return { transform: `translate(${x}px, ${y}px)` };
  };

  return (
    <div className={styles.body}>
      <div className={styles.tableContainer}>
        <h1 className={styles.detectiveName}>Detective {detectiveName}</h1>
        <div className={styles.table}>
          {playerList.map((player, index) => (
            <div
              key={index}
              className={styles.playerIcon}
              style={getPlayerPosition(index, playerList.length)}
            >
              {index === 0 ? 'You' : player}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TablePage;
