import { checkArgs } from 'src/utils';
import { createGameObjectTween } from '../object-move';
import * as objectUtils from '../utils';

export {
  hasGround,
  getGroundObject,
  getAlignVecWhenLeavingObject,
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
 * Get alignment vector for object leaving other object when moving by @vecMov
 * and when gravity is @vecGrav. E.g. object A goes right, leaves object B,
 * gravity is down. object A should be aligned to B with the vector [1, -1].
 * @param {Phaser.Point} vecMov @param {Phaser.Point} vecGrav
 * @return {Phaser.Point}
 */
function getAlignVecWhenLeavingObject(vecMov, vecGrav) {
  // take non-zero vecMove coord
  // take negative non-zero vecGrav coord
  return new Phaser.Point(
    getCoord('x', vecMov, vecGrav),
    getCoord('y', vecMov, vecGrav),
  );
  function getCoord(coord, vMov, vGrav) {
    if (vMov[coord] !== 0) {
      return vMov[coord];
    } else if (vGrav[coord] !== 0) {
      return -vGrav[coord];
    }
    console.error(`none of the vecs have non-zero ${coord} coord`);
    return null;
  }
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
