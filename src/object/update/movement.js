import * as utils from '../utils';
import { GRAV } from './gravity';
import { createTweenObj } from './utils';

export { handleMovement };

function handleMovement(o, objects, fieldSize) {
  if (o.$isTweenRunning()) {
    const gravAlignedToObjects = objects.filter(x => utils.alignedTo(
      o.$rec,
      x.$rec,
      GRAV.vec,
    ));
    if (gravAlignedToObjects.length > 0) {
      // find at least one future alignment
      const futureAlignedTo = gravAlignedToObjects.find(
        x => utils.willBeAligned(
          o.$rec,
          x.$rec,
          o.tweenObj.posTweened,
          GRAV.vec,
        ));
      if (futureAlignedTo) { // still aligned to at least one
        o.$setPos(o.tweenObj.posTweened); // continue the movement
      } else { // will go off the ground
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
  } else if (o.$getMoveVec()) {
    const tweenObj = createTweenObj(
      o,
      fieldSize,
      o.$getMoveVec(),
      1,
      Phaser.Easing.Linear.None,
      250,
    );
    tweenObj.tween.onComplete.add(function onComplete(posTweened) {
      o.$setPos(posTweened); // make final alignment
    });
    o.$setTweenObj(tweenObj);
    o.$zeroMoveVec();
  }
}
