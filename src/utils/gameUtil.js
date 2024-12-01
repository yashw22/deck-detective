import { COLORS, COUNTS, WEAPONS } from "../config/constants"


export const getWeaponDeck = () => {
    const deck = []
    WEAPONS.forEach(weapon => {
        COUNTS.forEach(count => {
            COLORS.forEach(color => {
                deck.push({ weapon: weapon, count: count, color: color, })
            })
        })
    })
    return deck
}
export const getSearchDeck = () => {
    const deck = []

    deck.push({
        elementsCount: 1,
        free: true
    })
    WEAPONS.forEach(weapon => {
        deck.push({ elementsCount: 1, weapon: weapon })
        deck.push({ elementsCount: 2, weapon: weapon, free: true })
    })
    COUNTS.forEach(count => {
        deck.push({ elementsCount: 1, count: count })
        deck.push({ elementsCount: 2, count: count, free: true })
    })
    WEAPONS.forEach(weapon => {
        COUNTS.forEach(count => {
            deck.push({ elementsCount: 2, weapon: weapon, count: count })
        })
    })
    COLORS.forEach(color => {
        deck.push({ elementsCount: 1, color: color })
        deck.push({ elementsCount: 2, color: color, free: true })

        WEAPONS.forEach(weapon => {
            deck.push({ elementsCount: 2, weapon: weapon, color: color })
        })
        COUNTS.forEach(count => {
            deck.push({ elementsCount: 2, count: count, color: color })
        })
    })


    return deck
}

export const sortCards = (a, b) => {
    // Compare colors
    const colorComparison =
        COLORS.indexOf(a.color) - COLORS.indexOf(b.color);
    if (colorComparison !== 0) return colorComparison;

    // Compare weapons
    const weaponComparison =
        WEAPONS.indexOf(a.weapon) - WEAPONS.indexOf(b.weapon);
    if (weaponComparison !== 0) return weaponComparison;

    // Compare counts
    const countComparison =
        COUNTS.indexOf(a.count) - COUNTS.indexOf(b.count);
    return countComparison;
}
export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

export const distributeWeaponCards = (numPlayers) => {
    var deck = shuffleArray(getWeaponDeck())

    const cardsPerPlayer = Math.floor((deck.length - 1) / numPlayers);
    var playerCards = Array.from({ length: numPlayers }, () => []);

    let cardIdx = 0;
    for (let i = 0; i < cardsPerPlayer; i++) {
        for (let j = 0; j < numPlayers; j++) {
            playerCards[j].push(deck[cardIdx++]);
        }
    }
    const resultCard = deck[cardIdx++];
    const commonCards = deck.slice(cardIdx);

    playerCards.forEach(playerDeck => playerDeck.sort(sortCards))
    commonCards.sort(sortCards)


    return [playerCards, commonCards, resultCard];
};
export const distributeSearchCards = (numPlayers) => {
    var deck = shuffleArray(getSearchDeck());

    var playerCards = Array.from({ length: numPlayers }, () => []);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < numPlayers; j++) {
            playerCards[j].push(deck.shift());
        }
    }
    return [playerCards, deck];
};

export const pickNextSearchCard = (searchDeck, usedDeck) => {
    if (searchDeck.length === 0) {
        searchDeck = shuffleArray(usedDeck);
        usedDeck = [];
    }
    const pickedSearchCard = searchDeck.shift();
    return [pickedSearchCard, searchDeck, usedDeck];
};

export const getCardMatches = (searchCard, playerCards) => {
    var filtered = playerCards;
    if ("weapon" in searchCard)
        filtered = filtered.filter((card) => card.weapon === searchCard.weapon);
    if (!filtered) return [];

    if ("count" in searchCard)
        filtered = filtered.filter((card) => card.count === searchCard.count);
    if (!filtered) return [];

    if ("color" in searchCard)
        filtered = filtered.filter((card) => card.color === searchCard.color);
    if (!filtered) return [];

    return filtered;
};

