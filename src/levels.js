import CONSTS from './consts';

// temporary sort solution: in the end Tiled will be used
const oKeys = Object.keys(CONSTS.OBJECT_TYPE).sort();

export default [
  [1, 0, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 2, 1, 1, 1],
  [1, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
].map(row => row.map(n => oKeys[n]));
