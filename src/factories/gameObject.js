import Phaser from 'phaser';
import { OBJECT_TYPE } from '../consts';

const movDur = 500;
const MOVABLE = [
  OBJECT_TYPE.ENEMY,
  OBJECT_TYPE.HERO,
];

function addTween(game, obj, vec) {
  return game.add.tween(obj).to({ x: obj.x + vec.x, y: obj.y + vec.y },
    movDur,
    Phaser.Easing.Bounce.Linear,
    true,
  );
}

function gameObject(type) {
  return {
    type,
    moving: false,
    movable: MOVABLE.includes(type),
    tweenMove: null,
    isMoving() { return this.moving; },
    move(vec) {
      if (this.isMoving()) { return; }
      this.tweenMove = addTween(this.game, this, vec);
      this.tweenMove.onComplete.add(() => {
        this.moving = false;
      });
      this.moving = true;
    },
    moveStop() {
      if (this.tweenMove) {
        this.tweenMove.stop();
      }
    },
  };
}

export default (sprite, {
  type,
}) => Object.assign(sprite, gameObject(type));
