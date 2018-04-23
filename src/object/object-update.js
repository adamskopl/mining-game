import { checkArgs } from 'src/utils';
import * as utils from './utils';
import { createGameObjectTween } from './object';

export { update };

const GRAV = {
  vec: new Phaser.Point(0, 1),
};
const GRAV_TIME = 1200;
const FIELDS_GRAVITY_NUMBER = 50; // arbitrary

function hasGround(o, objects) {
  checkArgs('hasGround', arguments, ['sprite', 'array']);
  return objects.some(x => utils.alignedTo(o.$rec, x.$rec, GRAV.vec));
}

function getGroundObject(o, objects) {
  checkArgs('getGroundObject', arguments, ['sprite', 'array']);
  return objects.find(x => utils.alignedTo(o.$rec, x.$rec, GRAV.vec));
}

/**
 * @param {GameObject} o
 * @param {number} fieldSize
 */
function createTweenObj(o, fieldSize, direction, fieldsNumber, easingFunction, duration) {
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

/**
 * @param {number} fieldSize
 */
function handleGravity(o, objects, fieldSize) {
  if (o.$isTweenRunning()) {
    const oIntersecting = objects.find(x => utils.willIntersect(
      o.$rec,
      x.$rec,
      o.tweenObj.posTweened,
    ));
    if (oIntersecting) {
      o.$alignTo(
        oIntersecting,
        Phaser.Point.negative(o.tweenObj.vecTweenN),
        0,
        0,
      );
    } else { // update position
      o.$setPos(o.tweenObj.posTweened);
    }
    const groundObject = getGroundObject(o, objects);
    if (groundObject) {
      o.$zeroTweenObj();
    }
  } else {
    o.$setTweenObj(createTweenObj(
      o,
      fieldSize,
      GRAV.vec,
      FIELDS_GRAVITY_NUMBER,
      Phaser.Easing.Cubic.In,
      GRAV_TIME,
    ));
  }
}

function handleMovement(o, objects, fieldSize) {
  if (o.$isTweenRunning()) {
    const alignedToObjects = objects.filter(x => utils.alignedTo(
      o.$rec,
      x.$rec,
      GRAV.vec,
    ));
    if (alignedToObjects.length > 0) {
      // find at least one future alignment
      const futureAlignedTo = alignedToObjects.find(x => utils.willBeAligned(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
        GRAV.vec,
      ));
      if (futureAlignedTo) { // still aligned to at least one
        o.$setPos(o.tweenObj.posTweened); // continue the movement
      } else { // will go off the ground
        if (alignedToObjects.length > 1) {
          console.error('handleMovement() should not happen:' +
                        'losing alignment with more than 1 object');
        }
        o.$alignTo(alignedToObjects[0], new Phaser.Point(
          o.tweenObj.vecTweenN.x,
          -1,
        ), 0, 0);
        o.$zeroTweenObj();
      }
    } else {
      console.error('handleMovement() should not happen: no alignment');
    }
  } else if (o.$getMoveVec()) {
    const tweenObj = createTweenObj(
      o,
      fieldSize,
      o.$getMoveVec(),
      1,
      Phaser.Easing.Linear.None,
      250,
    );
    tweenObj.tween.onComplete.add(function onComplete(posTweened) {
      o.$setPos(posTweened); // make final alignment
    });
    o.$setTweenObj(tweenObj);
    o.$zeroMoveVec();
  }
}

function update(o1, objects, fieldSize) {
  if (!hasGround(o1, objects)) {
    handleGravity(o1, objects, fieldSize);
  } else {
    handleMovement(o1, objects, fieldSize);
  }
}
