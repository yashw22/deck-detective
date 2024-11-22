// import { useState } from "react";
// import { getPlayers, getSearchDeck, getWeaponDeck } from "./lib/utils";

// const distributeWeaponCards = (playersCount) => {
//   var deck = getWeaponDeck();
//   const deckCount = deck.length;

//   for (let i = deckCount - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [deck[i], deck[j]] = [deck[j], deck[i]];
//   }

//   const cardsPerPlayer = Math.floor((deckCount - 1) / playersCount);
//   var playerWeaponCards = Array.from({ length: playersCount }, () => []);

//   let cardIdx = 0;
//   for (let i = 0; i < cardsPerPlayer; i++) {
//     for (let j = 0; j < playersCount; j++) {
//       playerWeaponCards[j].push(deck[cardIdx++]);
//     }
//   }
//   const resultCard = deck[cardIdx++];
//   const commonWeaponCards = deck.slice(cardIdx);

//   return { playerWeaponCards, commonWeaponCards, resultCard };
// };

// const distributeSearchCards = (playersCount) => {
//   var searchDeck = getSearchDeck();
//   const deckCount = searchDeck.length;

//   for (let i = deckCount - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [searchDeck[i], searchDeck[j]] = [searchDeck[j], searchDeck[i]];
//   }

//   var playerSearchCards = Array.from({ length: playersCount }, () => []);

//   for (let i = 0; i < 4; i++) {
//     for (let j = 0; j < playersCount; j++) {
//       playerSearchCards[j].push(searchDeck.shift());
//     }
//   }
//   return [playerSearchCards, searchDeck];
// };

// const pickNextSearchCard = (searchDeck, usedDeck) => {
//   if (searchDeck.length === 0) {
//     console.log("reshuffling usedDeck");
//     const deckCount = usedDeck.length;
//     for (let i = deckCount - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [usedDeck[i], usedDeck[j]] = [usedDeck[j], usedDeck[i]];
//     }
//     searchDeck = usedDeck;
//     usedDeck = [];
//   }
//   const pickedSearchCard = searchDeck.shift();
//   usedDeck.push(pickedSearchCard);
//   return [pickedSearchCard, searchDeck, usedDeck];
// };

// export default function TestGameLogic() {
//   const players = getPlayers();
// //   const { playerWeaponCards, commonWeaponCards, resultCard } =
// //     distributeWeaponCards(players.length);

//   var [playerSearchCards, newSearchDeck] = distributeSearchCards(
//     players.length
//   );

//   const [usedDeck, setUsedDeck] = useState([]);
//   const [searchDeck, setSearchDeck] = useState(newSearchDeck);
//   const [pickedSearchCard, setPickedSearchCard] = useState();
//   const [count, setCount] = useState(0);

//   const handleNextSearchCardPick = () => {
//     const [uPickedSearchCard, uSearchDeck, uUsedDeck] = pickNextSearchCard(
//       searchDeck,
//       usedDeck
//     );
//     console.log(searchDeck.length, usedDeck.length);
//     setUsedDeck(uUsedDeck);
//     setSearchDeck(uSearchDeck);
//     setPickedSearchCard(uPickedSearchCard);
//     setCount((c) => c + 1);
//   };

//   return (
//     <div>
//       <h1>Test Game Logic</h1>
//       <button onClick={handleNextSearchCardPick}>Get next Search Card</button>
//       <div>
//         Next Search Card: ({count}) {JSON.stringify(pickedSearchCard)}
//       </div>
//     </div>
//   );
// }
