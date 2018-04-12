import test from 'tape';
import {
  getFieldSize,
} from './level-utils';

test('getFieldSize', (t) => {
  [
    [new Phaser.Point(100, 100), new Phaser.Point(10, 10), 10],
    [new Phaser.Point(100, 100), new Phaser.Point(20, 20), 5],
    [new Phaser.Point(100, 100), new Phaser.Point(10, 20), 5],
    [new Phaser.Point(100, 100), new Phaser.Point(20, 10), 5],
    [new Phaser.Point(200, 50), new Phaser.Point(40, 5), 5],
  ].forEach((tc) => {
    t.equal(getFieldSize(tc[0], tc[1]), tc[2], `game of the size ${tc[0].x}x${tc[0].y}, with ${tc[1].x}x${tc[1].y} fields, will have field size of ${tc[2]}`);
  });
  t.end();
});
