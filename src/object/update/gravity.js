import * as utils from '../utils';
import { createTweenObj, getGroundObject } from './utils';
import { getGameObjectEventsForCollision } from './collision/collision';

const GRAV = {
  vec: new Phaser.Point(0, 1),
  time: 1200,
  fieldsNumber: 50, // arbitrary
};

export { GRAV, handleGravity };

/**
 * @param {number} fieldSize
 */
function handleGravity(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (o.$isTweenRunning()) {
    const objectsIntersecting = otherObjects.filter(x => utils.willIntersect(
      o.$rec,
      x.$rec,
      o.tweenObj.posTweened,
    ));
    if (objectsIntersecting.length > 0) {
      objectsEvents = objectsEvents.concat(
        getGameObjectEventsForCollision(
          o,
          GRAV.vec,
          GRAV.vec,
          objectsIntersecting,
        ),
      );
    }
    // continue the movement (object may be realigned during events resolve)
    o.$setPos(o.tweenObj.posTweened);
  } else {
    o.$setTweenObj(createTweenObj(
      o,
      fieldSize,
      GRAV.vec,
      GRAV.fieldsNumber,
      Phaser.Easing.Cubic.In,
      GRAV.time,
    ));
  }
  return objectsEvents;
}
