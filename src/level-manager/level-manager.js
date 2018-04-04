import createGameObject from 'src/object/object';
import bitmapsManager from 'src/bitmaps-manager/bitmaps-manager';

import { getGamePos } from '../display-utils';
import { getFieldSize } from '../level-utils';
import level from './levels';

// import { createGroupGameObjects, createGroupBackgroundObjects } from './sprites';

// dictionary
// size, width, height: for px (like in Phaser)
// dim: for other units. E.g. levelDim is for dimensions in fields

/**
 * @param {Phaser.Game} g
 * @param {Phaser.Point} fieldSize
 * @param {Level} level
 */
function createGroupGameObjects(g, fieldSize, level) {
    const group = g.add.group();
    // @param {OBJECT_TYPE}, @param {Phaser.Point}
    level.forEach((objectType, pos) => {
      if (objectType) {
        createGameObject(fieldSize * x, fieldSize * y, );
      }
    });
}

/**
 * @param {Phaser.Game} g
 * @param {Phaser.Point} fieldSize
 * @param {Level} level
 */
function createGroupBackgroundObjects(g, fieldSize, level) {
  const group = g.add.group();
}

function getGroupFieldPos(gameSize, levelSize) {
  return getGamePos(gameSize, levelSize);
}

function getLevelSize(l, fieldSize) {
  const dim = l.getDim();
  return [dim[0] * fieldSize, dim[1] * fieldSize];
}

export default {
  init(g) {
    this.g = g;
    // {Array<int>} [w, h]
    this.gameSize = null;
    this.groupGameObjects = this.g.add.group();
    this.groupBackgroundObjects = this.g.add.group();
    this.level = level;
    this.signalGroupReloaded = new Phaser.Signal();
    this.signalFieldResized = new Phaser.Signal();
  },
  onResize(gameSize) {
    this.gameSize = gameSize;

    const fieldSize = this.getFieldSize(this.gameSize, this.level);

    // reload background objects
    this.groupBackgroundObjects.removeAll();
    this.groupBackgroundObjects = createGroupBackgroundObjects(this.g, fieldSize, this.level);
    [this.groupBackgroundObjects.x, this.groupBackgroundObjects.y] =
      getGroupFieldPos(gameSize, getLevelSize(this.level, fieldSize));

    // reload game objects
    this.groupGameObjects.removeAll();
    this.groupGameObjects = createGroupGameObjects(this.g, fieldSize, this.level);
    [this.groupGameObjects.x, this.groupGameObjects.y] =
      getGroupFieldPos(gameSize, getLevelSize(this.level, fieldSize));

    this.signalGroupReloaded.dispatch(this.groupGameObjects);
    this.signalFieldResized.dispatch(fieldSize);
  },
  /**
   * @param {Array<int>} gameSize
   */
  getFieldSize(gameSize, level) {
    return getFieldSize(gameSize, level.getDim());
  },
};
