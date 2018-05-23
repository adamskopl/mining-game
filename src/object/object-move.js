import { checkArgs } from 'src/utils';

const MOVEMENT_TYPE = {
  UNTIL_OBSTACLE: 'UNTIL_OBSTACLE',
  UNTIL_LEAVES_FIELD: 'UNTIL_LEAVES_FIELD',
};

function $move(dir) {
  checkArgs('$move', arguments, ['point']);
  if (!this.$isTweenRunning()) {
    this.movement = createGameObjectMovement(dir);
  }
}

/**
 * @typedef {object} GameObjectMovement
 * @property {Phaser.Point} vecMoveN normalized
 */
function createGameObjectMovement(vecMoveN) {
  return {
    vecMoveN,
  };
}

const moveObject = {
  $initMov() {
    this.$zeroTweenObj();
  },
  $getMovement() {
    return this.movement;
  },
  /**
   * @param {Phaser.Point} vec
   */
  $setMovement(vec) {
    this.movement.vecMoveN = vec;
  },
  $setTweenObj(tweenObj) {
    checkArgs('$setTweenObj', arguments, ['object']);
    this.tweenObj = tweenObj;
  },
  $zeroTweenObj() {
    if (this.tweenObj && this.tweenObj.tween) {
      this.tweenObj.tween.stop(true); // fire onComplete
    }
    this.$setTweenObj(createGameObjectTween(
      null,
      null,
      null,
    ));
    this.movement = createGameObjectMovement(null);
  },
  $isTweenRunning() {
    return this.tweenObj.tween && this.tweenObj.tween.isRunning;
  },
  $move,
};

/**
 * @typedef {object} GameObjectTween
 * @property {?} posTweened
 * @property {?} tween
 * @property {Phaser.Vector} vecTweenN
 */
function createGameObjectTween(posTweened, tween, vecTweenN) {
  return {
    posTweened,
    tween,
    vecTweenN,
  };
}

export { MOVEMENT_TYPE, moveObject, createGameObjectTween };
