import { colorElements, colorHexs, defaultColorHex, defaultWeaponIcon, typeElements, weaponElements, weaponIcons } from "./constants"

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
        elementCount: 1,
        free: "free"
    })
    weaponElements.forEach(weapon => {
        searchDeck.push({ elementsCount: 1, weapon: weapon })
        searchDeck.push({ elementsCount: 2, weapon: weapon, free: "free" })
    })
    typeElements.forEach(type => {
        searchDeck.push({ elementsCount: 1, type: type })
        searchDeck.push({ elementsCount: 2, type: type, free: "free" })
    })
    weaponElements.forEach(weapon => {
        typeElements.forEach(type => {
            searchDeck.push({ elementsCount: 2, weapon: weapon, type: type })
        })
    })
    colorElements.forEach(color => {
        searchDeck.push({ elementsCount: 1, color: color })
        searchDeck.push({ elementsCount: 2, color: color, free: "free" })

        weaponElements.forEach(weapon => {
            searchDeck.push({ elementsCount: 2, weapon: weapon, color: color })
        })
        typeElements.forEach(type => {
            searchDeck.push({ elementsCount: 2, type: type, color: color })
        })
    })


    return searchDeck
}

export const getCardWeaponIcon = (weapon) => {
    return weaponElements.includes(weapon) ? weaponIcons[weapon] : defaultWeaponIcon
}

export const getCardColorHex = (color) => {
    return colorElements.includes(color) ? colorHexs[color] : defaultColorHex
}
