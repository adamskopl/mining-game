import * as utils from '../utils';
import { GRAV } from './gravity';
import { createTweenObj, getAlignVecWhenLeavingObject } from './utils';
import {
  getGameObjectEventsForIntersection,
} from './eventsDeterminants/intersection';
import {
  getGameObjectEventsForLeave,
} from './eventsDeterminants/leave';

export { handleMovement };

const MOV = {
  time: 10000,
  fieldsNumber: 50,
};

/**
 * @return {Array<GameObjectEvent>}
 */
function handleMovementForTween(o, otherObjects) {
  let objectsEvents = [];
  const gravAlignedToObjects = otherObjects.filter(x => utils.alignedTo(
    o.$rec,
    x.$rec,
    GRAV.vec,
  ));
  if (gravAlignedToObjects.length > 0) {
    // find at least one alignment to the *current* ground objects after the
    // movement
    const gravAlignedToObjectsAfter = gravAlignedToObjects.filter(
      x => utils.willBeAligned(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
        GRAV.vec,
      ),
    );
    if (gravAlignedToObjectsAfter.length > 0) {

      // TODO: FUNCTION!
      // ***** LEAVE RESOLUTION *****
      if (gravAlignedToObjects.length > gravAlignedToObjectsAfter.length) {
        objectsEvents = objectsEvents.concat(
          getGameObjectEventsForLeave(
            o,
            gravAlignedToObjects.find(x => x !== gravAlignedToObjectsAfter[0]),
            o.tweenObj.vecTweenN,
            GRAV.vec,
          ),
        );
      }

      // TODO: FUNCTION!
      // ***** INTERSECTION RESOLUTION *****
      // when update will keep the ground alignment
      const objectsIntersecting = otherObjects.filter(x => utils.willIntersect(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
      ));
      if (objectsIntersecting.length > 0) {
        objectsEvents = objectsEvents.concat(
          getGameObjectEventsForIntersection(
            o,
            o.tweenObj.vecTweenN,
            GRAV.vec,
            objectsIntersecting,
          ),
        );
      }
      // continue the movement (object may be realigned during events resolve)
      o.$setPos(o.tweenObj.posTweened);
    } else {
      // update will cause go off the ground
      // TODO: should be done in leaving.js?

      if (gravAlignedToObjects.length > 1) {
        console.error('handleMovement() should not happen:' +
          'losing alignment with more than 1 object');
      }
      o.$alignTo(
        gravAlignedToObjects[0],
        getAlignVecWhenLeavingObject(o.tweenObj.vecTweenN, GRAV.vec),
        0,
        0,
      );
      o.$stopMovement();
    }
  } else {
    console.error('handleMovement() should not happen: no alignment');
  }
  return objectsEvents;
}

function startTween(o, fieldSize) {
  const tweenObj = createTweenObj(
    o,
    fieldSize,
    o.$getMovement().vecMoveN,
    MOV.fieldsNumber,
    Phaser.Easing.Linear.None,
    MOV.time,
  );
  tweenObj.tween.onComplete.add(function onComplete(posTweened) {});
  o.$startMovement(tweenObj);
}

/**
 * @return {Array<GameObjectEvent>}
 */
function handleMovement(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (o.$isTweenRunning()) {
    objectsEvents = handleMovementForTween(o, otherObjects);
  } else if (o.$getMovement().vecMoveN) {
    startTween(o, fieldSize);
  }
  return objectsEvents;
}
