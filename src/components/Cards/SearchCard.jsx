import PropTypes from "prop-types";

export default function SearchCard({ card }) {
  console.log(card);

  // ToDO

  return <></>;
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
