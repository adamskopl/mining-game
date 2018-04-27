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

        const oIntersecting = objects.find(x => utils.willIntersect(
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
          o.tweenObj.vecTweenN.x,
          -1,
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
      1000,
    );
    tweenObj.tween.onComplete.add(function onComplete(posTweened) {
      o.$setPos(posTweened); // make final alignment
    });
    o.$setTweenObj(tweenObj);
    o.$zeroMoveVec();
  }
}
