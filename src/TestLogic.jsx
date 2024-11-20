import { getSearchDeck, getWeaponDeck } from "./lib/utils";

import PropertyCard from "./components/card/PropertyCard";
import InvestigationSheet from "./components/InvestigationSheet/InvestigationSheet";

export default function TestLogic() {
  const weaponDeck = getWeaponDeck();
  // // console.log("weaponDeck: ", weaponDeck);

  // const searchDeck = getSearchDeck();
  // console.log("searchDeck: ", searchDeck);

  var cards = [];
  for (let i = 0; i < 36; i++) {
    cards.push(
      <PropertyCard
        color={weaponDeck[i].color}
        type={weaponDeck[i].weapon}
        number={weaponDeck[i].type}
      />
    );
  }

  return (
    <div>
      <h1>Test Logics</h1>
      <InvestigationSheet />
      <div className="test-container">{cards}</div>
    </div>
  );
}
