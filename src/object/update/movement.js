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
  time: 4000,
  fieldsNumber: 50,
};

/**
 * @param {GameObject} o
 * @param {Array<GameObject>} gravAlignedToObjs
 * @param {Array<GameObject>} gravAlignedToObjsAfterMov
 * @return {Array<GameObjectEvent>}
 */
function getEventsForLeave(
  o,
  gravAlignedToObjs,
  gravAlignedToObjsAfterMov,
  gravVec,
) {
  checkArgs('getEventsForLeave', arguments, [
    'object',
    'array',
    'array',
    'point',
  ]);
  let res = [];
  if (gravAlignedToObjs.length > gravAlignedToObjsAfterMov.length) {
    // a) leaving object (2 aligned), there's another ground object (1 aligned)
    // b) leaving object (1 aligned), there are no ground objects (0 aligned)
    const objectLeft = gravAlignedToObjs.find(
      x => x !== gravAlignedToObjsAfterMov[0],
    );
    res = getGameObjectEventsForLeave(
      o,
      objectLeft,
      gravAlignedToObjsAfterMov[0] || null,
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
    const gravAlignedToObjectsAfterMov = gravAlignedToObjects.filter(
      x => utils.willBeAligned(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
        GRAV.vec,
      ),
    );
    // if (gravAlignedToObjectsAfterMov.length > 0) {
    objectsEvents = objectsEvents.concat(getEventsForLeave(
      o,
      gravAlignedToObjects,
      gravAlignedToObjectsAfterMov,
      GRAV.vec,
    ));
    objectsEvents = objectsEvents.concat(getEventsForIntersection(
      o,
      otherObjects,
    ));
    // continue the movement (object may be realigned during events resolve)
    o.$setPos(o.tweenObj.posTweened);
  } else {
    debugError('handleMovement() should not happen: no alignment');
  }
  return objectsEvents;
}

/**
 * @return {Array<GameObjectEvent>}
 */
function handleMovement(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (o.$isMoving()) {
    objectsEvents = handleMovementForTween(o, otherObjects);
  } else if (o.$getMovement().vecMoveN) {
    o.$startMovement(
      fieldSize,
      MOV.fieldsNumber,
      Phaser.Easing.Linear.None,
      MOV.time,
    );
  }
  return objectsEvents;
}
