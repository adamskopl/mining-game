import Phaser from 'phaser';

const movDur = 500;

const gameObject = () => ({
  moving: false,
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
});

export default (sprite, {
  type,
}) => Object.assign(sprite, Object.assign(gameObject(), {
  type,
}));
