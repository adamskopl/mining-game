import Phaser from 'phaser';

export function move(vec, fieldSize, object) {
  object.bringToTop();
  object.move(new Phaser.Point(vec.x * fieldSize, vec.y * fieldSize));
  // PUB: object started movement
}
