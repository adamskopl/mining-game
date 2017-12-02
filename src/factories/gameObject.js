import Phaser from 'phaser';
import { OBJECT_TYPE } from '../consts';

const movDur = 500;
const MOVABLE = [
  OBJECT_TYPE.ENEMY,
  OBJECT_TYPE.HERO,
];

function gameObject(type) {
  return {
    type,
    moving: false,
    movable: MOVABLE.includes(type),
    isMoving() { return this.moving; },
    move(vec) {
      if (this.isMoving()) { return; }
      this.game.add.tween(this).to(
        { x: this.x + vec[0], y: this.y + vec[1] },
        movDur,
        Phaser.Easing.Bounce.Out,
        true,
      ).onComplete.add(() => {
        this.moving = false;
      });
      this.moving = true;
    },
  };
}

export default (sprite, {
  type,
}) => Object.assign(sprite, gameObject(type));
