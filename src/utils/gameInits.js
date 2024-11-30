import { COLORS, COUNTS, WEAPONS } from "../config/constants";

export const initGridCells = (players) => {
    const boxes = {};
    WEAPONS.forEach((weapon) => {
        COUNTS.forEach((count) => {
            COLORS.forEach((color) => {
                boxes[weapon + count + color] = {
                    weapon: weapon,
                    count: count,
                    color: color,
                    valsB1: Object.fromEntries(players.map((key) => [key, false])),
                    valsB2: Object.fromEntries(players.map((key) => [key, false])),
                    focus: 0,
                    marked: false,
                    common: false,
                    label: "",
                };
            });
        });
    });
    return boxes;
};

export const initTally = (players) => {
    const tally = {};
    players.forEach((player) => (tally[player] = 0));
    return tally;
};

export const initNotes = (players) => {
    const notes = {};
    players.forEach((player) => (notes[player] = ""));
    return notes;
};