import * as utils from '../utils';
import { createTweenObj, getGroundObject } from './utils';

const GRAV = {
  vec: new Phaser.Point(0, 1),
  time: 1200,
  fieldsNumber: 50, // arbitrary
};

export { GRAV, handleGravity };

/**
 * @param {number} fieldSize
 */
function handleGravity(o, objects, fieldSize) {
  if (o.$isTweenRunning()) {
    const oIntersecting = objects.find(x => utils.willIntersect(
      o.$rec,
      x.$rec,
      o.tweenObj.posTweened,
    ));
    if (oIntersecting) {
      o.$alignTo(
        oIntersecting,
        Phaser.Point.negative(o.tweenObj.vecTweenN),
        0,
        0,
      );
      console.warn('COL', o.$type, oIntersecting.$type);
    } else { // update position
      o.$setPos(o.tweenObj.posTweened);
    }
    const groundObject = getGroundObject(o, objects, GRAV.vec);
    if (groundObject) {
      o.$zeroTweenObj();
    }
  } else {
    o.$setTweenObj(createTweenObj(
      o,
      fieldSize,
      GRAV.vec,
      GRAV.fieldsNumber,
      Phaser.Easing.Cubic.In,
      GRAV.time,
    ));
  }
}
