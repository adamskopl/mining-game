import R from 'ramda';
import bitmapsManager from './bitmaps-manager/bitmaps-manager';
import { getGamePos } from './display-utils';
import { getFieldSize, getLevelDim } from './level-utils';
import l from './levels';

// dictionary
// size, width, height: for px (like in Phaser)
// dim: for other units. E.g. levelDim is for dimensions in fields

function getGroupFieldPos(gameSize, levelSize) {
  return getGamePos(gameSize, levelSize);
}

// TODO: split to function returning sprites (quasi-pure) and function adding sprite to a group
function reloadSprites(gameSize, fieldSize, level, groupFields) {
  groupFields.removeAll();
  const ranges = [R.range(0, level[0].length), R.range(0, level.length)];
  ranges[0].forEach((x) => {
    ranges[1].forEach((y) => {
      if (level[y][x]) {
        groupFields.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap());
      }
    });
  });
}

function getLevelSize(level, fieldSize) {
  return [level[0].length * fieldSize, level.length * fieldSize];
}

export default {
  init(g) {
    this.game = g;
    this.gameSize = null;
    this.groupFields = this.game.add.group();
    this.level = l;
  },
  onResize(gameSize) {
    this.gameSize = gameSize;

    const fieldSize = this.getFieldSize();
    reloadSprites(gameSize, fieldSize, this.level, this.groupFields);
    [this.groupFields.x, this.groupFields.y] =
      getGroupFieldPos(gameSize, getLevelSize(this.level, fieldSize));
  },
  getFieldSize() {
    return getFieldSize(this.gameSize, getLevelDim(this.level));
  },
};
