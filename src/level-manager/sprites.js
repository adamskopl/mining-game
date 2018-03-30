import bitmapsManager from '../bitmaps-manager/bitmaps-manager';
import gameObject from '../factories/gameObject';
import { OBJECT_TYPE } from '../consts';

/**
 * @param {Object levels.js} level
 */
export function createGroupGameObjects(g, fieldSize, level) {
  const group = g.add.group();
  level.forEach((objectType, [x, y]) => {
    if (objectType) {
      const child = group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(objectType));
      group.replace(child, gameObject(child, { type: objectType }));
    }
  });
  return group;
}

// TODO: it's duplicating createGroupGameObjects
export function createGroupBackgroundObjects(g, fieldSize, level) {
  const group = g.add.group();
  level.forEach((objectType, [x, y]) => {
    group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(OBJECT_TYPE.EMPTY));
  });
  return group;
}
