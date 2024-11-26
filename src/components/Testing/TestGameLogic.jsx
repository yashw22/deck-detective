import { useState } from "react";

import { getPlayers } from "../../lib/utils";
import {
  distributeSearchCards,
  distributeWeaponCards,
  getMatchedCards,
  pickNextSearchCard,
} from "../../lib/gameUtils";

export default function TestGameLogic() {
  const players = getPlayers();

  const { playerWeaponCards, commonWeaponCards, resultCard } =
    distributeWeaponCards(players.length);

  var [playerSearchCards, newSearchDeck] = distributeSearchCards(
    players.length
  );

  const matchedCards = getMatchedCards(newSearchDeck[0], playerWeaponCards[0]);
  console.log("res", matchedCards);

  const [usedDeck, setUsedDeck] = useState([]);
  const [searchDeck, setSearchDeck] = useState(newSearchDeck);
  const [pickedSearchCard, setPickedSearchCard] = useState();
  const [count, setCount] = useState(0);

  const handleNextSearchCardPick = () => {
    const [uPickedSearchCard, uSearchDeck, uUsedDeck] = pickNextSearchCard(
      searchDeck,
      usedDeck
    );
    console.log(searchDeck.length, usedDeck.length);
    setUsedDeck(uUsedDeck);
    setSearchDeck(uSearchDeck);
    setPickedSearchCard(uPickedSearchCard);
    setCount((c) => c + 1);
  };

  return (
    <div>
      <h1>Test Game Logic</h1>
      <button onClick={handleNextSearchCardPick}>Get next Search Card</button>
      <div>
        Next Search Card: ({count}) {JSON.stringify(pickedSearchCard)}
      </div>
    </div>
  );
}
