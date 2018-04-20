import { OBJECT_TYPE } from '../consts';

const MOVE_DUR = 500;
const MOVABLE = [
  OBJECT_TYPE.ENEMY,
  OBJECT_TYPE.HERO,
];

function addTween(game, obj, vec, moveDur) {
  return game.add.tween(obj).to({ x: obj.x + vec.x, y: obj.y + vec.y },
    moveDur,
    Phaser.Easing.Bounce.Linear,
    true,
  );
}

function gameObject(type) {
  return {
    type,
    vecMove: new Phaser.Point(),
    movable: MOVABLE.includes(type),
    tweenMove: null,
    isMoving() { return !this.vecMove.isZero(); },
      move(vec) {
      if (this.isMoving()) { return; }
      this.vecMove.copyFrom(vec);
      this.tweenMove = addTween(this.game, this, this.vecMove, MOVE_DUR);
      this.tweenMove.onComplete.add(() => {
        this.vecMove.set(0, 0);
      });
    },
    moveStop() {
      if (this.tweenMove) {
        this.tweenMove.stop(true); // call onComplete
      }
    },
  };
}

export default (sprite, {
  type,
}) => Object.assign(sprite, gameObject(type));
