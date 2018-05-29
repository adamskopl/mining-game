import { MOVEMENT_TYPE } from 'src/object/object-move';
import * as utils from '../utils';
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
    o.$getMovement().tween.target,
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
  o.$setPos(o.$getMovement().tween.target);
  return objectsEvents;
}

/**
 * @param {number} fieldSize
 */
function handleGravity(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (o.$isMoving()) {
    objectsEvents = handleGravityForTween(o, otherObjects);
  } else {
    o.$setMovement(
      GRAV.vec,
      MOVEMENT_TYPE.ONE,
    );
    o.$startMovement(
      fieldSize,
      GRAV.fieldsNumber,
      Phaser.Easing.Cubic.In,
      GRAV.time,
    );
  }
  return objectsEvents;
}
