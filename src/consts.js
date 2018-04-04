/*
 * @typedef OBJECT_TYPE
 */
export const OBJECT_TYPE = {
  // temporary have to be *sorted* (until Tiled is used. check levels.js)
  EMPTY: 'EMPTY', // 0
  ENEMY: 'ENEMY', // 1
  FILLED: 'FILLED', // 2
  HERO: 'HERO', // 3
};

export const BITMAPS = {
  [OBJECT_TYPE.EMPTY]: '#000000',
  [OBJECT_TYPE.ENEMY]: '#c02800',
  [OBJECT_TYPE.FILLED]: '#dd6801',
  [OBJECT_TYPE.HERO]: '#dfdeec',
};

export default {
  OBJECT_TYPE,
  BITMAPS,
};
