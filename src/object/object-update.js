import { checkArgs } from 'src/utils';
import * as utils from './utils';

const Phaser = window.Phaser;

function hasGround(o, objects) {
  checkArgs('hasGround', arguments, ['sprite', 'array']);
  return objects.some(x => utils.alignedTo(o.$rec, x.$rec, new Phaser.Point(0, 1)));
}

function getGroundObject(o, objects) {
  return objects.find(x => utils.alignedTo(o.$rec, x.$rec, new Phaser.Point(0, 1)));
}

function hasGroundOld(o1, o2) {
  checkArgs('hasGround', arguments, ['sprite', 'sprite']);
  return utils.alignedTo(o1.$rec, o2.$rec, new Phaser.Point(0, 1));
}

export function createTweenObj(o, vecTranslate, dur) {
  checkArgs('createTweenObj', arguments, ['sprite', 'point', 'number']);
  const posTweened = new Phaser.Point(o.x, o.y);
  const tween = o.game.add.tween(posTweened).to({
    x: o.x + vecTranslate.x,
    y: o.y + vecTranslate.y,
  }, dur, Phaser.Easing.Bounce.Linear, true);
  const vecTweenN = vecTranslate.normalize();
  return {
    posTweened,
    tween,
    vecTweenN,
  };
}

function handleGravity(o, objects) {
  if (o.$isTweenRunning()) {
    const oIntersecting = objects.find(
      x => utils.willIntersect(o.$rec, x.$rec, o.tweenObj.posTweened));
    if (oIntersecting) {
      o.$alignTo(oIntersecting, Phaser.Point.negative(o.tweenObj.vecTweenN), 0, 0);
    } else { // update position
      o.$setPos(o.tweenObj.posTweened);
    }
    const groundObject = getGroundObject(o, objects);
    if (groundObject) {
      o.$zeroTweenObj();
    }
  } else {
    o.$setTweenObj(createTweenObj(o, new Phaser.Point(0, 200), 2000));
  }
}

function handleMovement(o, objects) {
  if (o.$isTweenRunning()) {
    const alignedToObjects = objects.filter(
      x => utils.alignedTo(o.$rec, x.$rec, new Phaser.Point(0, 1)));
    if (alignedToObjects.length > 0) {
      // find at least one future alignment
      const futureAlignedTo = alignedToObjects.find(
        x => utils.willBeAligned(
          o.$rec, x.$rec, o.tweenObj.posTweened, new Phaser.Point(0, 1),
        ));
      if (futureAlignedTo) { // still aligned to at least one
        o.$setPos(o.tweenObj.posTweened); // continue the movement
      } else { // will go off the ground
        if (alignedToObjects.length > 1) {
          console.error('handleMovement() should not happen: losing alignment with more than 1' +
            'object');
        }
        o.$alignTo(alignedToObjects[0], new Phaser.Point(o.tweenObj.vecTweenN.x, -1), 0, 0);
        o.$zeroTweenObj();
      }
    } else {
      console.error('handleMovement() should not happen: no alignment');
    }
  } else if (o.vecMoveN) {
    o.$setTweenObj(createTweenObj(o, o.vecMoveN.clone().multiply(200, 200), 2000));
    o.vecMoveN = null;
  }
}

export function update(o1, objects) {
  if (!hasGround(o1, objects)) {
    handleGravity(o1, objects);
  } else {
    handleMovement(o1, objects);
  }
}
