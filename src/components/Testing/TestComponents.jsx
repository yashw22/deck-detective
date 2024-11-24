import ElementCard from "../Cards/ElementCard";
import InvestigationSheet from "../InvestigationSheet/InvestigationSheet";
import { getPlayers, getWeaponDeck } from "../../lib/utils";

export default function TestComponents() {
  const players = getPlayers();
  const weaponDeck = getWeaponDeck();

  var cards = [];
  weaponDeck.forEach((card, index) =>
    cards.push(<ElementCard key={index} card={card} />)
  );

  return (
    <div>
      {/* <h1>Test Components</h1> */}
      {/* <div style={{ display: "flex", flexWrap: "wrap" }}>{cards}</div> */}
      <InvestigationSheet players={players} />
    </div>
  );
}
