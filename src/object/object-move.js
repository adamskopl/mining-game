import { debugError } from 'src/utils';

/**
 * @typedef {object} MovementType
 */
const MOVEMENT_TYPE = {
  ONE: 'MOVEMENT_ONE', // move one field
  CONST: 'MOVEMENT_CONST', // just move
};
const MOVEMENT_TYPE_KEYS = Object.keys(MOVEMENT_TYPE);

const moveObject = {
  $initMov() {
    this.$movement = null;
    this.$gravityEnabled = false;
  },
  $enableGravity(vecGrav) {
    this.$gravityEnabled = true;
    this.$setMovement(vecGrav, MOVEMENT_TYPE.CONST);
  },
  $isGravityEnabled() {
    return this.$gravityEnabled;
  },
  /**
   * @return {GameObjectMovement}
   */
  $getMovement() {
    return this.$movement;
  },
  $setMovement(
    vecMoveN,
    type,
    tween = null,
  ) {
    if (vecMoveN !== null && this.$getMovement() !== null) {
      debugError('setting movement when it\'s already set');
    }
    if (!MOVEMENT_TYPE_KEYS.find(k => MOVEMENT_TYPE[k] === type)) {
      debugError(`no "${type}" movement type`);
    }
    this.$movement = {
      vecMoveN,
      type,
      tween,
    };
  },
  $isMovementSet() {
    return this.$movement !== null;
  },
  $startMovement(
    fieldSize,
    fieldsNumber,
    easingFunction,
    duration,
  ) {
    const {
      vecMoveN,
    } = this.$movement;
    const toObj = Object.assign(
      {},
      vecMoveN.x ? {
        x: vecMoveN.x + (fieldsNumber * fieldSize * vecMoveN.x),
      } : {},
      vecMoveN.y ? {
        y: this.y + (fieldsNumber * fieldSize * vecMoveN.y),
      } : {},
    );
    const tween = this.game.add.tween(new Phaser.Point(this.x, this.y))
      .to(
        toObj,
        duration,
        easingFunction,
        true,
      );
    Object.assign(this.$movement, {
      tween,
    });
  },
  $stopMovement() {
    if (this.$movement && this.$movement.tween) {
      // allow multiple $stopMovement, e.g. for simultaneous stop for
      // intersection and alignment
      this.$movement.tween.stop(true); // fire onComplete
    }
    this.$movement = null;
  },
  $isMoving() {
    return this.$isMovementSet() && this.$getMovement().tween;
  },
};

export {
  MOVEMENT_TYPE,
  moveObject,
};
