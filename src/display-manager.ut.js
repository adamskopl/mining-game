import test from 'tape';
import {
  getGameAreaSize,
  getGamePos,
} from './display-utils';

test('getGameAreaSize', (t) => {
  [ // [appW, appH], [marginX, maringY], [gameAreaW, gameAreaH]
    [[100, 100], [0.1, 0.1], [80, 80]],
    [[800, 600], [0.15, 0.15], [560, 420]],
    [[600, 800], [0.12, 0.35], [456, 240]],
    [[0, 0], [0, 0], [0, 0]],
    [[-2, 800], [0.2, 0.3], null],
  ].forEach((p) => {
    t.deepEqual(getGameAreaSize(p[0], p[1]), p[2], 'game area properly calculated for the given values');
  });
  t.end();
});

test('getGamePos', (t) => {
  // [appW, appH], [gameAreaW, gameAreaH], [gameAreaX, [gameAreaY]
  [
    [[800, 600], [200, 200], [300, 200]],
    [[0, 0], [0, 0], [0, 0]],
    [[200, 200], [-100, -100], null],
    [[100, 10], [80, 5], [10, 2.0]], // Math.floor
    [[20, 20], [100, 100], null],
  ].forEach((p) => {
    t.deepEqual(getGamePos(p[0], p[1]), p[2]);
  });
  t.end();
});
