export const OBJECT_TYPE = {
  // temporary have to be sorted (until Tiled is used. check levels.js)
  EMPTY: 'EMPTY',
  FILLED: 'FILLED',
  HERO: 'HERO',
};

export const BITMAPS = {
  [OBJECT_TYPE.EMPTY]: '#000000',
  [OBJECT_TYPE.FILLED]: '#dd6801',
  [OBJECT_TYPE.HERO]: '#dfdeec',
};

export default {
  OBJECT_TYPE,
  BITMAPS,
};
