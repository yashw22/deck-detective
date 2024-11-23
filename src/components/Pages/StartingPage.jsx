import React, { useState } from 'react';
import styles from './StartingPage.module.css';

const StartingPage = () => {
  const [name, setName] = useState(''); // Store the detective's name
  const [isGamePage, setIsGamePage] = useState(false); // Toggle between pages

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setIsGamePage(true); // Move to the second page
    } else {
      alert('Please enter a valid name!');
    }
  };

  const handleCreateGame = () => {
    alert('Create Game selected!'); // Replace with navigation logic
  };

  const handleJoinGame = () => {
    alert('Join Game selected!'); // Replace with navigation logic
  };

  return (
    <div className={styles.body}>
      {!isGamePage ? (
        /* First Page: Enter Name */
        <div className={styles.card}>
          <h1 className={styles.title}>Deck Detective</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Your Detective Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Begin Investigation
            </button>
          </form>
        </div>
      ) : (
        /* Second Page: Game Options */
        <div className={styles.card}>
          <h1 className={styles.title}>Detective {name}</h1>
          <p>What would you like to do?</p>
          <button
            className={styles.optionButton}
            onClick={handleCreateGame}
          >
            Create Game
          </button>
          <button
            className={styles.optionButton}
            onClick={handleJoinGame}
          >
            Join Game
          </button>
        </div>
      )}
    </div>
  );
};

export default StartingPage;
