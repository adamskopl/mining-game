import { checkArgs, debugError } from 'src/utils';
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
 * @param {GameObject} o
 * @param {Array<GameObject>} gravAlignedToObjs
 * @param {Array<GameObject>} gravAlignedToObjsAfter
 * @return {Array<GameObjectEvent>}
 */
function getEventsForLeave(
  o,
  gravAlignedToObjs,
  gravAlignedToObjsAfter,
  gravVec,
) {
  checkArgs('getEventsForLeave', arguments, [
    'object',
    'array',
    'array',
    'point',
  ]);
  let res = [];
  if (gravAlignedToObjs.length > gravAlignedToObjsAfter.length) {
    const objectsLeft = gravAlignedToObjs.find(
      x => x !== gravAlignedToObjsAfter[0],
    );
    res = getGameObjectEventsForLeave(
      o,
      objectsLeft,
      o.tweenObj.vecTweenN,
      gravVec,
    );
  }
  return res;
}

function getEventsForIntersection(o, otherObjects) {
  checkArgs('getEventsForIntersection', arguments, [
    'object',
    'array',
  ]);
  let res = [];
  const objectsIntersecting = otherObjects.filter(x => utils.willIntersect(
    o.$rec,
    x.$rec,
    o.tweenObj.posTweened,
  ));
  if (objectsIntersecting.length > 0) {
    res = getGameObjectEventsForIntersection(
      o,
      o.tweenObj.vecTweenN,
      objectsIntersecting,
    );
  }
  return res;
}

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
      objectsEvents = objectsEvents.concat(getEventsForLeave(
        o,
        gravAlignedToObjects,
        gravAlignedToObjectsAfter,
        GRAV.vec,
      ));
      objectsEvents = objectsEvents.concat(getEventsForIntersection(
        o,
        otherObjects,
      ));
      // continue the movement (object may be realigned during events resolve)
      o.$setPos(o.tweenObj.posTweened);
    } else {
      // update will cause go off the ground
      // TODO: should be done in leaving.js?

      if (gravAlignedToObjects.length > 1) {
        debugError('handleMovement() should not happen:' +
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
    debugError('handleMovement() should not happen: no alignment');
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
  // tweenObj.tween.onComplete.add(function onComplete(posTweened) {});
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
