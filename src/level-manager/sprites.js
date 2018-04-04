import bitmapsManager from '../bitmaps-manager/bitmaps-manager';
import gameObject from '../factories/gameObject';
import { OBJECT_TYPE } from '../consts';

/**
 * @param {Phaser.Game} g
 * @param {Phaser.Point} fieldSize
 * @param {Level} level
 */
export function createGroupGameObjects(g, fieldSize, level) {
  const group = g.add.group();
  level.forEach((objectType, [x, y]) => {
    if (objectType) {

      // 1. create
      // 2. OVERWRITE??
      const child = group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(objectType));
      group.replace(child, gameObject(child, { type: objectType }));
    }
  });
  return group;
}

// TODO: it's duplicating createGroupGameObjects
/**
 * @param {Phaser.Game} g
 * @param {Phaser.Point} fieldSize
 * @param {Level} level
 */
export function createGroupBackgroundObjects(g, fieldSize, level) {
  const group = g.add.group();
  level.forEach((objectType, [x, y]) => {
    group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(OBJECT_TYPE.EMPTY));
  });
  return group;
}
