import createGameObject from 'src/object/object';
import bitmapsManager from 'src/bitmaps-manager/bitmaps-manager';
import { checkArgs } from 'src/utils';
import { OBJECT_TYPE } from 'src/consts';
import { getGamePos } from '../display-utils';
import { getFieldSize } from '../level-utils';
import level from './levels';

// dictionary
// size, width, height: for px (like in Phaser)
// dim: for other units. E.g. levelDim is for dimensions in fields

/**
 * @param {Phaser.Game} g
 * @param {Phaser.Point} fieldSize
 * @param {Level} level
 * @return {Phaser.Group}
 */
function createGroupGameObjects(g, fieldSize, lvl) {
  checkArgs('createGroupGameObjects', arguments, [
    'object', 'number', 'object',
  ]);
  const group = g.add.group();
  // @param {OBJECT_TYPE}, @param {Phaser.Point}
  lvl.forEach((objectType, pos) => {
    if (objectType) {
      createGameObject(
        objectType,
        new Phaser.Point(fieldSize * pos.x, fieldSize * pos.y),
        group,
        bitmapsManager.getBitmapData(objectType),
      );
    }
  });
  return group;
}

/**
 * @param {Phaser.Game} g
 * @param {number} fieldSize
 * @param {Level} level
 * @return {Phaser.Group}
 */
function createGroupBackgroundObjects(g, fieldSize, lvl) {
  checkArgs('createGroupBackgroundObjects', arguments, [
    'object', 'number', 'object',
  ]);
  const group = g.add.group();
  lvl.forEach((objectType, pos) => {
    group.create(
      fieldSize * pos.x, fieldSize * pos.y,
      bitmapsManager.getBitmapData(OBJECT_TYPE.EMPTY),
    );
  });
  return group;
}

function getLevelSize(l, fieldSize) {
  checkArgs('getLevelSize', arguments, [
    'object', 'number',
  ]);
  const dim = l.getDim();
  return new Phaser.Point(dim.x * fieldSize, dim.y * fieldSize);
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
  /**
   * @param {Phaser.Point} gameSize
   */
  onResize(gameSize) {
    // checkArgs('onResize', arguments, ['point']);
    this.gameSize = gameSize;

    const fieldSize = this.getFieldSize(this.gameSize, this.level);

    // reload background objects
    this.groupBackgroundObjects.removeAll();
    this.groupBackgroundObjects = createGroupBackgroundObjects(
      this.g,
      fieldSize,
      this.level,
    );

    const gamePos = getGamePos(gameSize, getLevelSize(this.level, fieldSize));
    [
      this.groupBackgroundObjects.x,
      this.groupBackgroundObjects.y,
    ] = [
      gamePos.x,
      gamePos.y,
    ];

    // reload game objects
    this.groupGameObjects.removeAll();
    this.groupGameObjects = createGroupGameObjects(
      this.g,
      fieldSize,
      this.level,
    );
    [this.groupGameObjects.x, this.groupGameObjects.y] = [gamePos.x, gamePos.y];

    this.signalGroupReloaded.dispatch(this.groupGameObjects);
    this.signalFieldResized.dispatch(fieldSize);
  },
  /**
   * @param {Array<int>} gameSize
   * @return
   */
  getFieldSize(gameSize, lvl) {
    return getFieldSize(gameSize, lvl.getDim());
  },
};
