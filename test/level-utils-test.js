import test from 'tape';
import {
  getFieldSize,
  levelPosToPos,
} from '../src/level-utils';

test('getFieldSize', (t) => {
  [
    [[100, 100], [10, 10], 10],
    [[100, 100], [20, 20], 5],
    [[100, 100], [10, 20], 5],
    [[100, 100], [20, 10], 5],
    [[200, 50], [40, 5], 5],
  ].forEach((p) => {
    t.deepEqual(getFieldSize(p[0], p[1]), p[2]);
  });
  t.end();
});

test('levelPosToPos', (t) => {
  [
    [[0, 0], [0, 100], 30, [0, 100]],
    [[1, 1], [100, 100], 20, [120, 120]],
    [[3, 1], [100, 0], 15, [145, 15]],
  ].forEach((p) => {
    t.deepEqual(levelPosToPos(p[0], p[1], p[2]), p[3]);
  });
  t.end();
});
