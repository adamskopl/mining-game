import { checkArgs, debugError } from 'src/utils';

/**
 * @typedef {object} MovementType
 */
const MOVEMENT_TYPE = {
  ONE: 'MOVEMENT_ONE', // move one field
};

const moveObject = {
  $initMov() {
    this.$movement = createGameObjectMovement(null, null);
    this.$stopMovement();
  },
  /**
   * @return {GameObjectMovement}
   */
  $getMovement() {
    return this.$movement;
  },
  /**
   * @param {GameObjectMovement} gameObjectMovement
   */
  $setMovement(gameObjectMovement) {
    if (!gameObjectMovement.isNull() && !this.$getMovement().isNull()) {
      debugError('setting movement when it\'s already set');
    }
    this.$movement = gameObjectMovement;
  },
  $startMovement(
    fieldSize,
    fieldsNumber,
    easingFunction,
    duration,
  ) {
    const { vecMoveN } = this.$movement;
    const posTweened = new Phaser.Point(this.x, this.y);

    const toObj = Object.assign(
      {},
      vecMoveN.x ? {
        x: vecMoveN.x + (fieldsNumber * fieldSize * vecMoveN.x),
      } : {},
      vecMoveN.y ? {
        y: this.y + (fieldsNumber * fieldSize * vecMoveN.y),
      } : {},
    );
    const tween = this.game.add.tween(posTweened)
      .to(
        toObj,
        duration,
        easingFunction,
        true,
      );
    this.tweenObj = createGameObjectTween(posTweened, tween, vecMoveN);
  },
  $stopMovement() {
    if (this.tweenObj && this.tweenObj.tween) {
      this.tweenObj.tween.stop(true); // fire onComplete
    }
    this.tweenObj = null;
    this.$setMovement(createGameObjectMovement(null, null));
  },
  $isMoving() {
    return this.tweenObj !== null;
  },
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

const GameObjectMovementProto = {
  isNull() {
    return this.vecMoveN === null && this.type === null;
  },
};

/**
 * @typedef {object} GameObjectMovement
 * @property {Phaser.Point} vecMoveN normalized
 * @property {MovementType} type
 */
function createGameObjectMovement(vecMoveN, type) {
  return Object.assign(
    Object.create(GameObjectMovementProto), {
      vecMoveN,
      type,
    },
  );
}

export {
  MOVEMENT_TYPE,
  moveObject,
  createGameObjectMovement,
};
