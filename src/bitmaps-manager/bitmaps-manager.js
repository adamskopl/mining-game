import levelManager from '../level-manager';

const DOT_SIZE = 3;
let bmd = null;
let game = null;
const debug = false;

function reloadBitmap(fieldSize) {
  const LINE_LEN = fieldSize - (DOT_SIZE * 2);
  bmd.resize(fieldSize, fieldSize);
  bmd.rect(0, 0, fieldSize, fieldSize, '#000000');
  // border:
  if (debug) {
    bmd.rect(DOT_SIZE, 0, LINE_LEN, DOT_SIZE, '#c12023');
    bmd.rect(fieldSize - DOT_SIZE, DOT_SIZE, DOT_SIZE, LINE_LEN, '#4a9941');
    bmd.rect(DOT_SIZE, fieldSize - DOT_SIZE, LINE_LEN, DOT_SIZE, '#2f6cbc');
    bmd.rect(0, DOT_SIZE, DOT_SIZE, LINE_LEN, '#FFFFFF');
  }
}

export default {
  init(g) {
    game = g;
    bmd = g.add.bitmapData(1, 1);
    game.cache.addBitmapData('testBitmap', bmd);
  },
  onResize() {
    reloadBitmap(levelManager.getFieldSize());
  },
  getBitmap() {
    return game.cache.getBitmapData('testBitmap');
  },
};
