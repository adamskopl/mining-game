import * as utils from '../utils';
import { GRAV } from './gravity';
import { createTweenObj } from './utils';
import { getGameObjectEventsForCollision } from './collision/collision';

export { handleMovement };

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
    // find at least one future alignment to the ground
    const futureAlignedTo = gravAlignedToObjects.find(
      x => utils.willBeAligned(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
        GRAV.vec,
      ),
    );
    if (futureAlignedTo) {
      // when update will keep the ground alignment
      const objectsIntersecting = otherObjects.filter(x => utils.willIntersect(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
      ));
      if (objectsIntersecting.length > 0) {
        objectsEvents = objectsEvents.concat(
          getGameObjectEventsForCollision(
            o,
            o.tweenObj.vecTweenN,
            GRAV.vec,
            objectsIntersecting,
          ),
        );
      }
      // continue the movement (SOMETIMES)
      o.$setPos(o.tweenObj.posTweened);
    } else { // update will cause go off the ground
      if (gravAlignedToObjects.length > 1) {
        console.error('handleMovement() should not happen:' +
          'losing alignment with more than 1 object');
      }
      o.$alignTo(gravAlignedToObjects[0], new Phaser.Point(
        o.tweenObj.vecTweenN.x,
        -1,
      ), 0, 0);
      o.$zeroTweenObj();
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
    o.$getMoveVec(),
    1,
    Phaser.Easing.Linear.None,
    200,
  );
  tweenObj.tween.onComplete.add(function onComplete(posTweened) {
    o.$setPos(posTweened); // make final alignment
  });
  o.$setTweenObj(tweenObj);
  o.$zeroMoveVec();
}

/**
 * @return {Array<GameObjectEvent>}
 */
function handleMovement(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (o.$isTweenRunning()) {
    objectsEvents = handleMovementForTween(o, otherObjects);
  } else if (o.$getMoveVec()) {
    startTween(o, fieldSize);
  }
  return objectsEvents;
}
