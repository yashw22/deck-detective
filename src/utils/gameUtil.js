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

export const distributeWeaponCards = (numPlayers) => {
    var deck = getWeaponDeck();
    const deckLen = deck.length;

    for (let i = deckLen - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const cardsPerPlayer = Math.floor((deckLen - 1) / numPlayers);
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
    var deck = getSearchDeck();
    const deckLen = deck.length;

    for (let i = deckLen - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

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
        const deckLen = usedDeck.length;
        for (let i = deckLen - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [usedDeck[i], usedDeck[j]] = [usedDeck[j], usedDeck[i]];
        }
        searchDeck = usedDeck;
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

