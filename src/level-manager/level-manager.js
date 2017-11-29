import Phaser from 'phaser';
import { getGamePos } from '../display-utils';
import { getFieldSize, getLevelDim } from '../level-utils';
import l from './levels';
import getSprites from './sprites';

// dictionary
// size, width, height: for px (like in Phaser)
// dim: for other units. E.g. levelDim is for dimensions in fields

function getGroupFieldPos(gameSize, levelSize) {
  return getGamePos(gameSize, levelSize);
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
    this.groupFields = getSprites(this.g, fieldSize, this.level);
    [this.groupFields.x, this.groupFields.y] =
      getGroupFieldPos(gameSize, getLevelSize(this.level, fieldSize));

    this.signalGroupReloaded.dispatch(this.groupFields);
    this.signalFieldResized.dispatch(fieldSize);
  },
  getFieldSize() {
    return getFieldSize(this.gameSize, getLevelDim(this.level));
  },
};
