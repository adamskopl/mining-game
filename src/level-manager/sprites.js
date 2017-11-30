import R from 'ramda';
import bitmapsManager from '../bitmaps-manager/bitmaps-manager';
import gameObject from '../factories/gameObject';

/**
 * @param {Object levels.js} level
 */
export default function getSprites(g, fieldSize, level) {
  const group = g.add.group();
  level.forEach((objectType, [x, y]) => {
    // TODO: not 'object' but...
    const child = group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(objectType));
    group.replace(child, gameObject(child, { type: objectType }));
  });
  return group;
}
