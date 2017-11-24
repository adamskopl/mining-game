import R from 'ramda';
import Phaser from 'phaser';
import bitmapsManager from '../bitmaps-manager/bitmaps-manager';
import { getGamePos } from '../display-utils';
import { getFieldSize, getLevelDim } from '../level-utils';
import l from './levels';
import gameObject from '../factories/gameObject';

// dictionary
// size, width, height: for px (like in Phaser)
// dim: for other units. E.g. levelDim is for dimensions in fields

function getGroupFieldPos(gameSize, levelSize) {
  return getGamePos(gameSize, levelSize);
}

// TODO: split to function returning sprites (quasi-pure) and function adding sprite to a group
function getSprites(g, gameSize, fieldSize, level) {
  const group = g.add.group();
  const ranges = [R.range(0, level[0].length), R.range(0, level.length)];
  ranges[0].forEach((x) => {
    ranges[1].forEach((y) => {
      const field = level[y][x];
      field.forEach((f) => {
          const child = group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(f));
          group.replace(child, gameObject(child, { type: f }));
      });
    });
  });
  return group;
}

function getLevelSize(level, fieldSize) {
  return [level[0].length * fieldSize, level.length * fieldSize];
}

export default {
  init(g) {
    this.g = g;
    this.gameSize = null;
    this.groupFields = this.g.add.group();
    this.level = l;
    this.signalGroupReloaded = new Phaser.Signal();
    this.signalFieldResized = new Phaser.Signal();
  },
  onResize(gameSize) {
    this.gameSize = gameSize;

    const fieldSize = this.getFieldSize();
    this.groupFields.removeAll();
    this.groupFields = getSprites(this.g, gameSize, fieldSize, this.level, this.groupFields);
    [this.groupFields.x, this.groupFields.y] =
      getGroupFieldPos(gameSize, getLevelSize(this.level, fieldSize));

    this.signalGroupReloaded.dispatch(this.groupFields);
    this.signalFieldResized.dispatch(fieldSize);
  },
  getFieldSize() {
    return getFieldSize(this.gameSize, getLevelDim(this.level));
  },
};
