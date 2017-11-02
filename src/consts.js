// constants with game elements
export const EMPTY = 0;
export const WALL = 1;
export const SPOT = 2;
export const CRATE = 3;
export const PLAYER = 4;
// according to these values, the crate on the spot = CRATE+SPOT = 5 and the
// player on the spot = PLAYER+SPOT = 6

export const level = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 4, 2, 1, 3, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];
