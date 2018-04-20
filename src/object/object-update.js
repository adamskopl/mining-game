import { checkArgs } from 'src/utils';
import * as utils from './utils';
import { createGameObjectTween } from './object';

// najpier kierunek grawitacji tutaj na sztywno... a potem zmieniac.
// powinne dzialac wszystkie.
const GRAV = {
  vec: new Phaser.Point(1, 0),
  vecMulti: new Phaser.Point(500, 500),
};

function hasGround(o, objects) {
  checkArgs('hasGround', arguments, ['sprite', 'array']);
  return objects.some(x => utils.alignedTo(o.$rec, x.$rec, GRAV.vec));
}

function getGroundObject(o, objects) {
  checkArgs('getGroundObject', arguments, ['sprite', 'array']);
  return objects.find(x => utils.alignedTo(o.$rec, x.$rec, GRAV.vec));
}

/**
 * Create {GameObjectTween} ignoring zero coordinates of the translation vector.
 * @return {GameObjectTween}
 */
export function createTweenObj(o, vecTranslate, dur) {
  checkArgs('createTweenObj', arguments, ['sprite', 'point', 'number']);
  const posTweened = new Phaser.Point(o.x, o.y);

  const toObj = Object.assign(
    {},
    vecTranslate.x ? { x: vecTranslate.x } : {},
    vecTranslate.y ? { y: vecTranslate.y } : {},
  );
  const tween = o.game.add.tween(posTweened).to(
    toObj,
    dur,
    Phaser.Easing.Cubic.In,
    true,
  );
  const vecTweenN = vecTranslate.normalize();
  return createGameObjectTween(posTweened, tween, vecTweenN);
}

function handleGravity(o, objects, gameSize) {
  if (o.$isTweenRunning()) {
    const oIntersecting = objects.find(
      x => utils.willIntersect(o.$rec, x.$rec, o.tweenObj.posTweened));
    if (oIntersecting) {
      o.$alignTo(oIntersecting, Phaser.Point.negative(o.tweenObj.vecTweenN), 0, 0);
    } else { // update position
      o.$setPos(o.tweenObj.posTweened);
    }
    const groundObject = getGroundObject(o, objects);
    if (groundObject) {
      o.$zeroTweenObj();
    }
  } else {
    // TODO: one target of the gravity, but speed varies: smaller distance,
    // shorter time. like ine gravity.
    // 1. one point, out of the game area, indicating gravity
    // let gravPoint;
    // let borderPointY = null;
    // if (GRAV.vec.y > 0) {
    //   borderPointY = gameSize.y - 1;
    // } else if (GRAV.vec.y < 0) {
    //   borderPointY = 0;
    // }
    // borderPointY += GRAV_VEC_MULTI.y * GRAV.vec.y;

    // MOVE ME SOMEWHERE
    function calcGravityForCoord(coord) {
      let ret = 0;
      if (GRAV.vec[coord]) {
        let borderPoint = null;
        if (GRAV.vec[coord] > 0) {
          borderPoint = gameSize[coord] - 1;
        } else {
          borderPoint = 0;
        }
        ret = borderPoint + (GRAV.vecMulti[coord] * GRAV.vec[coord]);
      }
      return ret;
    }


    o.$setTweenObj(createTweenObj(
      o,
      new Phaser.Point(calcGravityForCoord('x'), calcGravityForCoord('y')),
      2000));
  }
}

function handleMovement(o, objects) {
  if (o.$isTweenRunning()) {
    const alignedToObjects = objects.filter(
      x => utils.alignedTo(o.$rec, x.$rec, GRAV.vec));
    if (alignedToObjects.length > 0) {
      // find at least one future alignment
      const futureAlignedTo = alignedToObjects.find(
        x => utils.willBeAligned(
          o.$rec, x.$rec, o.tweenObj.posTweened, GRAV.vec,
        ));
      if (futureAlignedTo) { // still aligned to at least one
        o.$setPos(o.tweenObj.posTweened); // continue the movement
      } else { // will go off the ground
        if (alignedToObjects.length > 1) {
          console.error('handleMovement() should not happen: losing alignment with more than 1' +
            'object');
        }
        o.$alignTo(alignedToObjects[0], new Phaser.Point(o.tweenObj.vecTweenN.x, -1), 0, 0);
        o.$zeroTweenObj();
      }
    } else {
      console.error('handleMovement() should not happen: no alignment');
    }
  } else if (o.vecMoveN) {
    // o.$setTweenObj(createTweenObj(o, o.vecMoveN.clone().multiply(200, 200), 2000));
    o.vecMoveN = null;
  }
}

export function update(o1, objects, gameSize) {
  if (!hasGround(o1, objects)) {
    handleGravity(o1, objects, gameSize);
  } else {
    handleMovement(o1, objects);
  }
}
