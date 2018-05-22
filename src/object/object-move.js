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
  $getMovement() {
    return this.movement;
  },
  /**
   * @param {Phaser.Point} vec
   */
  $setMovement(vec) {
    this.movement.vecMoveN = vec;
  },
  $zeroMoveVec() {
    this.movement = createGameObjectMovement(null);
  },
  $initMov() {
    this.$zeroMoveVec();
  },
  $move,
};

export { MOVEMENT_TYPE, moveObject };
