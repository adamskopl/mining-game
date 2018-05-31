import { MOVEMENT_TYPE } from 'src/object/object-move';
import { getEventsForIntersection } from './utils';

const GRAV = {
  vec: new Phaser.Point(0, 1),
  time: 600,
  fieldsNumber: 50, // arbitrary
};

export { GRAV, handleGravity };

function handleGravityForTween(o, otherObjects) {
  let objectsEvents = [];
  objectsEvents = objectsEvents.concat(getEventsForIntersection(
    o,
    otherObjects,
    GRAV.vec,
  ));
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
    o.$stopMovement();
    o.$enableGravity(GRAV.vec);
    o.$startMovement(
      fieldSize,
      GRAV.fieldsNumber,
      Phaser.Easing.Cubic.In,
      GRAV.time,
    );
  }
  return objectsEvents;
}
