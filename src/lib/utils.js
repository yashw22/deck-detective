import { colorHexs, defaultColorHex, defaultWeaponIcon, weaponIcons } from "./gameConstants"

export const getWeaponIcon = (weapon) => {
    return weapon in weaponIcons ? weaponIcons[weapon] : defaultWeaponIcon
}

export const getColorHex = (color) => {
    return color in colorHexs ? colorHexs[color] : defaultColorHex
}

export const lightenColor = (color, magnitude) => {
    var hex = getColorHex(color)
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const decimalColor = parseInt(hex, 16);
    let r = (decimalColor >> 16) + magnitude;
    let g = ((decimalColor >> 8) & 0x00FF) + magnitude;
    let b = (decimalColor & 0x0000FF) + magnitude;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

export const getPlayers = () => {
    // return ["P1", "P2", "P3", "P4"]
    return ["Kj", "Mm", "Sj", "Yw"]
}