import { COLOR_HEXS, COLOR_NAMES, COUNT_NAMES, DEFAULT_COLOR_HEX, WEAPON_ICONS } from "../config/constants"


export const getString = (arg) => {
    if (arg in WEAPON_ICONS) return WEAPON_ICONS[arg]
    if (arg in COUNT_NAMES) return COUNT_NAMES[arg]
    if (arg in COLOR_NAMES) return COLOR_NAMES[arg]
    return "Unknown"
}

export const getHex = (color) => {
    return color in COLOR_HEXS ? COLOR_HEXS[color] : DEFAULT_COLOR_HEX
}

export const lightenHex = (color, percentage = 20) => {
    let hex = getHex(color).slice(1);
    if (hex.length === 3)
        hex = hex.split('').map(c => c + c).join('');

    const rgb = parseInt(hex, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = rgb & 0xff;

    const lighten = (val) => Math.min(255, Math.max(0, val + (255 - val) * (percentage / 100)));
    r = lighten(r);
    g = lighten(g);
    b = lighten(b);

    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1).padStart(6, '0')}`;
}

export const darkenHex = (color, percentage = 20) => {
    let hex = getHex(color).slice(1);
    if (hex.length === 3)
        hex = hex.split('').map(c => c + c).join('');

    const rgb = parseInt(hex, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = rgb & 0xff;

    const darken = (val) => Math.max(0, val - (val * (percentage / 100)));
    r = darken(r);
    g = darken(g);
    b = darken(b);

    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1).padStart(6, '0')}`;
}

export const generateString = (len = 6) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let random = "";
    for (let i = 0; i < len; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return random;
}