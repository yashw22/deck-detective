import ElementCard from "../Cards/ElementCard";
import { getSearchDeck, getWeaponDeck } from "../../lib/gameUtil";
import SearchCard from "../Cards/SearchCard";
// import { getPlayers } from "../../lib/utils";
// import InvestigationSheet from "../InvestigationSheet/InvestigationSheet";

export default function TestComponents() {
  // const players = getPlayers();
  const weaponDeck = getWeaponDeck();

  var wCards = [];
  weaponDeck.forEach((card, index) =>
    wCards.push(<ElementCard key={index} card={card} />)
  );

  
  const searchDeck = getSearchDeck();
  var sCards = [];
  searchDeck.forEach((card, index) =>
    sCards.push(<SearchCard key={index} card={card} />)
  );

  return (
    <div>
      <h1>Test Components</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{wCards}</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{sCards}</div>
      {/* <InvestigationSheet players={players} /> */}
    </div>
  );
}
