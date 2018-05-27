import * as utils from '../utils';
import { createTweenObj } from './utils';
import {
  getGameObjectEventsForIntersection,
} from './eventsDeterminants/intersection';

const GRAV = {
  vec: new Phaser.Point(0, 1),
  time: 600,
  fieldsNumber: 50, // arbitrary
};

export { GRAV, handleGravity };

function handleGravityForTween(o, otherObjects) {
  let objectsEvents = [];
  const objectsIntersecting = otherObjects.filter(x => utils.willIntersect(
    o.$rec,
    x.$rec,
    o.tweenObj.posTweened,
  ));
  if (objectsIntersecting.length > 0) {
    objectsEvents = objectsEvents.concat(
      getGameObjectEventsForIntersection(
        o,
        GRAV.vec,
        objectsIntersecting,
      ),
    );
  }
  // continue the movement (object may be realigned during events resolve)
  o.$setPos(o.tweenObj.posTweened);
  return objectsEvents;
}

function startTween(o, fieldSize) {
  o.$startMovement(createTweenObj(
    o,
    fieldSize,
    GRAV.vec,
    GRAV.fieldsNumber,
    Phaser.Easing.Cubic.In,
    GRAV.time,
  ));
}

/**
 * @param {number} fieldSize
 */
function handleGravity(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (o.$isTweenRunning()) {
    objectsEvents = handleGravityForTween(o, otherObjects);
  } else {
    startTween(o, fieldSize);
  }
  return objectsEvents;
}
