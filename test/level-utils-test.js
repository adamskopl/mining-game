import test from 'tape';
import {
  getFieldSize,
  levelPosToPos,
  getLevelSize,
} from '../src/level-utils';

test('getFieldSize', (t) => {
  [
    [[100, 100], [10, 10], 10],
    [[100, 100], [20, 20], 5],
    [[100, 100], [10, 20], 5],
    [[100, 100], [20, 10], 5],
    [[200, 50], [40, 5], 5],
  ].forEach((tc) => {
    t.deepEqual(getFieldSize(tc[0], tc[1]), tc[2]);
  });
  t.end();
});

test('levelPosToPos', (t) => {
  [
    [[0, 0], [0, 100], 30, [0, 100]],
    [[1, 1], [100, 100], 20, [120, 120]],
    [[3, 1], [100, 0], 15, [145, 15]],
  ].forEach((tc) => {
    t.deepEqual(levelPosToPos(tc[0], tc[1], tc[2]), tc[3]);
  });
  t.end();
});

test('getLevelSize', (t) => {
  const getLevel = ([w, h]) = Array(h).fill(Array(w).fill(0));
  [
    [0, 0], [1, 1], [2, 5], [5, 2]
  ].forEach((tc) => {
    t.deepEqual(getLevelSize(getLevel(tc)), tc);
  });
  t.end();
});
