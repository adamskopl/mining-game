import * as utils from '../utils';
import { GRAV } from './gravity';
import { createTweenObj } from './utils';

export { handleMovement };

function handleMovementForTween(o, otherObjects) {
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
      ));
    if (futureAlignedTo) {
      // update will keep the ground alignment

      // check intersection

      const oIntersecting = otherObjects.find(x => utils.willIntersect(
        o.$rec,
        x.$rec,
        o.tweenObj.posTweened,
      ));
      if (oIntersecting) {
        // console.warn('INTERS', oIntersecting.$type);
      }
      // continue the movement (SOMETIMES)
      o.$setPos(o.tweenObj.posTweened);
    } else { // update will cause go off the ground
      if (gravAlignedToObjects.length > 1) {
        console.error('handleMovement() should not happen:' +
          'losing alignment with more than 1 object');
      }
      o.$alignTo(gravAlignedToObjects[0], new Phaser.Point(
        o.tweenObj.vecTweenN.x, -1,
      ), 0, 0);
      o.$zeroTweenObj();
    }
  } else {
    console.error('handleMovement() should not happen: no alignment');
  }
}

function startTween(o, fieldSize) {
  const tweenObj = createTweenObj(
    o,
    fieldSize,
    o.$getMoveVec(),
    1,
    Phaser.Easing.Linear.None,
    1000,
  );
  tweenObj.tween.onComplete.add(function onComplete(posTweened) {
    o.$setPos(posTweened); // make final alignment
  });
  o.$setTweenObj(tweenObj);
  o.$zeroMoveVec();
}

/**
 * @return {GameObjectUpdateRes}
 */
function handleMovement(o, otherObjects, fieldSize) {
  if (o.$isTweenRunning()) {
    handleMovementForTween(o, otherObjects);
  } else if (o.$getMoveVec()) {
    startTween(o, fieldSize);
  }
}
