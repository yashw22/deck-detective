// import { getWeaponDeck } from "./lib/utils";
// import { getSearchDeck } from "./lib/utils";

// import ElementCard from "./components/Cards/ElementCard";
import InvestigationSheet from "./components/InvestigationSheet/InvestigationSheet";

export default function TestLogic() {
  // const weaponDeck = getWeaponDeck();
  // // console.log("weaponDeck: ", weaponDeck);

  // const searchDeck = getSearchDeck();
  // // console.log("searchDeck: ", searchDeck);

  // var cards = [];
  // for (let i = 0; i < 36; i++) {
  //   cards.push(<ElementCard key={"card-"+i} card={weaponDeck[i]} />);
  // }

  return (
    <div>
      {/* <h1>Test Logics</h1> */}
      <InvestigationSheet />
      {/* <div className="test-container">{cards}</div> */}
    </div>
  );
}
