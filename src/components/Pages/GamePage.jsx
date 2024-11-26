import PropTypes from "prop-types";

export default function GamePage({ myName }) {
  return (
    <div>
      <h1>Detective {myName}</h1>
      <div>Game Page</div>
    </div>
  );
}

GamePage.propTypes = {
  myName: PropTypes.string.isRequired,
};
