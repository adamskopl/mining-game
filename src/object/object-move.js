import { checkArgs } from 'src/utils';

function $move(dir) {
  checkArgs('$move', arguments, ['point']);
  console.warn('move!');
  if (!this.$isTweenRunning()) {
    this.vecMoveN = dir;
  }
}

export default {
  $getMoveVec() {
    return this.vecMoveN;
  },
  $zeroMoveVec() {
    this.vecMoveN = null;
  },
  $initMov() {
    this.$zeroMoveVec();

    this.vecMoveN = new Phaser.Point(1, 0);


  },
  $move,
};
