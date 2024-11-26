import { colorElements, typeElements, weaponElements } from "./gameConstants"


export const getWeaponDeck = () => {
    const weaponDeck = []
    weaponElements.forEach(weapon => {
        typeElements.forEach(type => {
            colorElements.forEach(color => {
                weaponDeck.push({ weapon: weapon, type: type, color: color, })
            })
        })
    })
    return weaponDeck
}
export const getSearchDeck = () => {
    const searchDeck = []

    searchDeck.push({
        elementsCount: 1,
        free: true
    })
    weaponElements.forEach(weapon => {
        searchDeck.push({ elementsCount: 1, weapon: weapon })
        searchDeck.push({ elementsCount: 2, weapon: weapon, free: true })
    })
    typeElements.forEach(type => {
        searchDeck.push({ elementsCount: 1, type: type })
        searchDeck.push({ elementsCount: 2, type: type, free: true })
    })
    weaponElements.forEach(weapon => {
        typeElements.forEach(type => {
            searchDeck.push({ elementsCount: 2, weapon: weapon, type: type })
        })
    })
    colorElements.forEach(color => {
        searchDeck.push({ elementsCount: 1, color: color })
        searchDeck.push({ elementsCount: 2, color: color, free: true })

        weaponElements.forEach(weapon => {
            searchDeck.push({ elementsCount: 2, weapon: weapon, color: color })
        })
        typeElements.forEach(type => {
            searchDeck.push({ elementsCount: 2, type: type, color: color })
        })
    })


    return searchDeck
}


export const distributeWeaponCards = (playersCount) => {
    var deck = getWeaponDeck();
    const deckCount = deck.length;

    for (let i = deckCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const cardsPerPlayer = Math.floor((deckCount - 1) / playersCount);
    var playerWeaponCards = Array.from({ length: playersCount }, () => []);

    let cardIdx = 0;
    for (let i = 0; i < cardsPerPlayer; i++) {
        for (let j = 0; j < playersCount; j++) {
            playerWeaponCards[j].push(deck[cardIdx++]);
        }
    }
    const resultCard = deck[cardIdx++];
    const commonWeaponCards = deck.slice(cardIdx);

    return { playerWeaponCards, commonWeaponCards, resultCard };
};

export const distributeSearchCards = (playersCount) => {
    var searchDeck = getSearchDeck();
    const deckCount = searchDeck.length;

    for (let i = deckCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [searchDeck[i], searchDeck[j]] = [searchDeck[j], searchDeck[i]];
    }

    var playerSearchCards = Array.from({ length: playersCount }, () => []);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < playersCount; j++) {
            playerSearchCards[j].push(searchDeck.shift());
        }
    }
    return [playerSearchCards, searchDeck];
};

export const pickNextSearchCard = (searchDeck, usedDeck) => {
    if (searchDeck.length === 0) {
        // console.log("reshuffling usedDeck");
        const deckCount = usedDeck.length;
        for (let i = deckCount - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [usedDeck[i], usedDeck[j]] = [usedDeck[j], usedDeck[i]];
        }
        searchDeck = usedDeck;
        usedDeck = [];
    }
    const pickedSearchCard = searchDeck.shift();
    usedDeck.push(pickedSearchCard);
    return [pickedSearchCard, searchDeck, usedDeck];
};

export const getMatchedCards = (searchCard, playerCards) => {
    var filtered = playerCards;
    if ("weapon" in searchCard)
        filtered = filtered.filter((card) => card.weapon === searchCard.weapon);
    if (!filtered) return [];

    if ("type" in searchCard)
        filtered = filtered.filter((card) => card.type === searchCard.type);
    if (!filtered) return [];

    if ("color" in searchCard)
        filtered = filtered.filter((card) => card.color === searchCard.color);
    if (!filtered) return [];

    return filtered;
};
