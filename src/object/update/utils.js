import { checkArgs } from 'src/utils';
import { createGameObjectTween } from '../object';
import * as objectUtils from '../utils';

export {
  hasGround,
  getGroundObject,
  createTweenObj,
};

function hasGround(o, objects, gravVec) {
  checkArgs('hasGround', arguments, ['sprite', 'array', 'point']);
  return objects.some(x => objectUtils.alignedTo(o.$rec, x.$rec, gravVec));
}

function getGroundObject(o, objects, gravVec) {
  checkArgs('getGroundObject', arguments, ['sprite', 'array', 'point']);
  return objects.find(x => objectUtils.alignedTo(o.$rec, x.$rec, gravVec));
}

/**
 * @param {GameObject} o
 * @param {number} fieldSize
 */
function createTweenObj(
  o,
  fieldSize,
  direction,
  fieldsNumber,
  easingFunction,
  duration,
) {
  const posTweened = new Phaser.Point(o.x, o.y);
  // gravity speed should be the same for every game's resolution: it should
  // depend on the field size
  const toObj = Object.assign(
    {},
    direction.x ? {
      x: o.x + (fieldsNumber * fieldSize * direction.x),
    } : {},
    direction.y ? {
      y: o.y + (fieldsNumber * fieldSize * direction.y),
    } : {},
  );
  const tween = o.game.add.tween(posTweened)
    .to(
      toObj,
      duration,
      easingFunction,
      true,
    );
  return createGameObjectTween(posTweened, tween, direction);
}
