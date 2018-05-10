/**
 * @typedef {object} GameObjectType
 */
export const GAME_OBJECT_TYPE = {
  // temporary have to be *sorted* (until Tiled is used. check levels.js)
  EMPTY: 'EMPTY', // 0
  FILLED: 'FILLED', // 1
  FRIEND: 'FRIEND', // 2
  HERO: 'HERO', // 3
};

export const BITMAPS = {
  [GAME_OBJECT_TYPE.EMPTY]: '#000000',
  [GAME_OBJECT_TYPE.FILLED]: '#dd6801',
  [GAME_OBJECT_TYPE.FRIEND]: '#c02800',
  [GAME_OBJECT_TYPE.HERO]: '#dfdeec',
};
