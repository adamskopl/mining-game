import { checkArgs } from 'src/utils';

function $move(dir) {
  checkArgs('$move', arguments, ['point']);
  if (!this.$isTweenRunning()) {
    this.vecMoveN = dir;
  }
}

export default {
  $getMoveVec() {
    return this.vecMoveN;
  },
  /**
   * @param {Phaser.Point} vec
   */
  $setMoveVec(vec) {
    this.vecMoveN = vec;
  },
  $zeroMoveVec() {
    this.vecMoveN = null;
  },
  $initMov() {
    // this.$setMoveVec(new Phaser.Point(1, 0));
    this.$zeroMoveVec();
  },
  $move,
};
