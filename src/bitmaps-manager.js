import CONSTS from './consts';
import displayManager from './display-manager';
import { getFieldSize } from './level-utils';

let bmd = null;
let game = null;
const DOT_SIZE = 3;

function reloadBitmap(fieldSize) {
  const LINE_LEN = fieldSize - (DOT_SIZE * 2);
  bmd.resize(fieldSize, fieldSize);
  bmd.rect(0, 0, fieldSize, fieldSize, '#000000');
  // border:
  bmd.rect(DOT_SIZE, 0, LINE_LEN, DOT_SIZE, '#c12023');
  bmd.rect(fieldSize - DOT_SIZE, DOT_SIZE, DOT_SIZE, LINE_LEN, '#4a9941');
  bmd.rect(DOT_SIZE, fieldSize - DOT_SIZE, LINE_LEN, DOT_SIZE, '#2f6cbc');
  bmd.rect(0, DOT_SIZE, DOT_SIZE, LINE_LEN, '#FFFFFF');
}

export default {
  init(g) {
    let fieldSize = null;
    game = g;
    fieldSize = getFieldSize(displayManager.getSize(), CONSTS.FIELDS);
    bmd = g.add.bitmapData(fieldSize, fieldSize);
    game.cache.addBitmapData('testBitmap', bmd);
  },
  onResize() {
    const fieldSize = getFieldSize(displayManager.getSize(), CONSTS.FIELDS);
    reloadBitmap(fieldSize);
  },
  getBitmap() {
    return game.cache.getBitmapData('testBitmap');
  },
};
