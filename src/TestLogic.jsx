import { getSearchDeck, getWeaponDeck } from "./lib/utils";

export default function TestLogic() {
  const weaponDeck = getWeaponDeck();
  console.log("weaponDeck: ", weaponDeck);

  const searchDeck = getSearchDeck();
  console.log("searchDeck: ", searchDeck);

  return (
    <div>
      <h1>Test Logics</h1>
    </div>
  );
}
