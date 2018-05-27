import { checkArgs } from 'src/utils';

/**
 * @typedef {object} MovementType
 */
const MOVEMENT_TYPE = {
  ONE: 'MOVEMENT_ONE', // move one field
  CONSTANT: 'MOVEMENT_CONSTANT', // keep moving
};

function $move(dir) {
  checkArgs('$move', arguments, ['point']);
  if (!this.$isMoving()) {
    this.movement = createGameObjectMovement(dir);
  }
}

const moveObject = {
  $initMov() {
    this.$stopMovement();
  },
  /**
   * @return {GameObjectMovement}
   */
  $getMovement() {
    return this.movement;
  },
  /**
   * @param {Phaser.Point} vec
   */
  $setMovement(gameObjectMovement) {
    this.movement = gameObjectMovement;
  },
  $startMovement(tweenObj) {
    checkArgs('$startMovement', arguments, ['object']);
    this.tweenObj = tweenObj;
  },
  $stopMovement() {
    if (this.tweenObj && this.tweenObj.tween) {
      this.tweenObj.tween.stop(true); // fire onComplete
    }
    this.$startMovement(createGameObjectTween(
      null,
      null,
      null,
    ));
    this.$setMovement(createGameObjectMovement(null));
  },
  $isMoving() {
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

/**
 * @typedef {object} GameObjectMovement
 * @property {Phaser.Point} vecMoveN normalized
 * @property {MovementType} type
 */
function createGameObjectMovement(vecMoveN, type) {
  return {
    vecMoveN,
    type,
  };
}

export {
  MOVEMENT_TYPE,
  moveObject,
  createGameObjectMovement,
  createGameObjectTween,
};
