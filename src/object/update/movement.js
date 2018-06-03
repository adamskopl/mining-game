import { checkArgs, debugError } from 'src/utils';
import * as objectUtils from '../utils';
import { GRAV } from './gravity';
import { getEventsForIntersection } from './utils';
import {
  getGameObjectEventsForLeave,
} from './eventsDeterminants/leave';

import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from '../object-event';

export { handleMovement };

const MOV = {
  time: 7000,
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
      o.$getMovement().vecMoveN,
      gravVec,
    );
  }
  return res;
}

/**
 * @return {Array<GameObjectEvent>}
 */
function handleMovementForTween(o, otherObjects) {
  let objectsEvents = [];
  const gravAlignedToObjects = otherObjects.filter(x => objectUtils.alignedTo(
    o.$rec,
    x.$rec,
    GRAV.vec,
  ));
  if (gravAlignedToObjects === 0) {
    debugError('handleMovement() should not happen: no alignment');
  }
  const groundMoving = gravAlignedToObjects.some(g => g.$isMoving());
  if (groundMoving) {
    // stop object if object beneath is moving
    objectsEvents.push(createGameObjectEvent(
      GAME_OBJECT_EVENT_TYPE.STOP,
      o,
    ));
  } else {
    // find at least one alignment to the *current* ground objects after the
    // movement
    const gravAlignedToObjectsAfterMov = gravAlignedToObjects.filter(
      x => objectUtils.willBeAligned(
        o.$rec,
        x.$rec,
        o.$getMovement().tween.target,
        GRAV.vec,
      ),
    );
    objectsEvents = objectsEvents.concat(getEventsForLeave(
      o,
      gravAlignedToObjects,
      gravAlignedToObjectsAfterMov,
      GRAV.vec,
    ));
    objectsEvents = objectsEvents.concat(getEventsForIntersection(
      o,
      otherObjects,
      GRAV.vec,
    ));
    // continue the movement (object may be realigned during events resolve)
    o.$setPos(o.$getMovement().tween.target);
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
  } else if (o.$isMovementSet()) {
    o.$startMovement(
      fieldSize,
      MOV.fieldsNumber,
      Phaser.Easing.Linear.None,
      MOV.time,
    );
  }
  return objectsEvents;
}
