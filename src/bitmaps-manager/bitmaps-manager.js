import CONSTS from '../consts';

const DOT_SIZE = 3;
let game = null;
const debug = false;

// MAKE MORE PURE
function reloadBitmaps(bitmaps, fieldSize) {
  const LINE_LEN = fieldSize - (DOT_SIZE * 2);

  Object.keys(bitmaps).forEach((k) => {
    const b = bitmaps[k];
    b.resize(fieldSize, fieldSize);
    b.rect(0, 0, fieldSize, fieldSize, CONSTS.BITMAPS[k]);
    // border:
    if (debug) {
      b.rect(DOT_SIZE, 0, LINE_LEN, DOT_SIZE, '#c12023');
      b.rect(fieldSize - DOT_SIZE, DOT_SIZE, DOT_SIZE, LINE_LEN, '#4a9941');
      b.rect(DOT_SIZE, fieldSize - DOT_SIZE, LINE_LEN, DOT_SIZE, '#2f6cbc');
      b.rect(0, DOT_SIZE, DOT_SIZE, LINE_LEN, '#FF');
    }
  });
}

export default {
  init(g) {
    game = g;
    // initialize bitmaps, add them to cache
    this.bitmaps = {};
    Object.keys(CONSTS.OBJECT_TYPE).reduce((arr, key) => {
      arr.push([key, g.add.bitmapData(1, 1)]);
      return arr;
    }, []).forEach(([name, bitmap]) => {
      this.bitmaps[name] = bitmap;
      game.cache.addBitmapData(name, bitmap);
    });
  },
  onFieldResize(fieldSize) {
    reloadBitmaps(this.bitmaps, fieldSize);
  },
  getBitmap(name) {
    return game.cache.getBitmapData(name);
  },
};
