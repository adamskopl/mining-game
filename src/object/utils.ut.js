import test from 'tape';
import * as utils from './utils';

const intersectDirTestData = [
  [[0, 0, 10, 10], [0, 0, 10, 10]], // same position + (0, 0)

  [[0, 0, 10, 10], [0, -5, 10, 10]], // same position + (0, -5)
  [[0, 0, 10, 10], [5, 0, 10, 10]], // same position + (5, 0)
  [[0, 0, 10, 10], [0, 5, 10, 10]], // same position + (0, 5)
  [[0, 0, 10, 10], [-5, 0, 10, 10]], // same position + (-5, 0)

  [[0, 0, 10, 10], [0, -9, 10, 10]], // same position + (0, -9)
  [[0, 0, 10, 10], [9, 0, 10, 10]], // same position + (9, 0)
  [[0, 0, 10, 10], [0, 9, 10, 10]], // same position + (0, 9)
  [[0, 0, 10, 10], [-9, 0, 10, 10]], // same position + (-9, 0)

  [[0, 0, 10, 10], [0, -10, 10, 10]], // same position + (0, -10)
  [[0, 0, 10, 10], [10, 0, 10, 10]], // same position + (10, 0)
  [[0, 0, 10, 10], [0, 10, 10, 10]], // same position + (0, 10)
  [[0, 0, 10, 10], [-10, 0, 10, 10]], // same position + (-10, 0)
];

const intersectTestData = [
  [[0, 0, 10, 10], [0, 0, 10, 10], true], // r1, r2, res

  [[0, 0, 10, 10], [-9, 0, 10, 10], true],
  [[0, 0, 10, 10], [-10, 0, 10, 10], false],

  [[0, 0, 10, 10], [9, 0, 10, 10], true],
  [[0, 0, 10, 10], [10, 0, 10, 10], false],

  [[0, 0, 10, 10], [0, -9, 10, 10], true],
  [[0, 0, 10, 10], [0, -10, 10, 10], false],

  [[0, 0, 10, 10], [0, 9, 10, 10], true],
  [[0, 0, 10, 10], [0, 10, 10, 10], false],
];

const willIntersectData = [
  [[0, 0, 10, 10], [10, 0, 10, 10], [1, 0], true], // rec1, rec2, rec1TargetPos, true

  [[0, 0, 10, 10], [-11, 0, 10, 10], [-1, 0], false],
  [[0, 0, 10, 10], [-10, 0, 10, 10], [-19, 0], true],
  [[0, 0, 10, 10], [-10, 0, 10, 10], [-20, 0], false],

  [[0, 0, 10, 10], [11, 0, 10, 10], [1, 0], false],
  [[0, 0, 10, 10], [10, 0, 10, 10], [19, 0], true],
  [[0, 0, 10, 10], [10, 0, 10, 10], [20, 0], false],

  [[0, 0, 10, 10], [0, -11, 10, 10], [0, -1], false],
  [[0, 0, 10, 10], [0, -10, 10, 10], [0, -19], true],
  [[0, 0, 10, 10], [0, -10, 10, 10], [0, -20], false],

  [[0, 0, 10, 10], [0, 11, 10, 10], [0, 1], false],
  [[0, 0, 10, 10], [0, 10, 10, 10], [0, 19], true],
  [[0, 0, 10, 10], [0, 10, 10, 10], [0, 20], false],
];

const alignmentTestData = [
  [[0, 0, 10, 10], [0, 0, 10, 10], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 1], false],

  [[0, 0, 10, 10], [5, 5, 10, 10], [-1, 0], false],
  [[0, 0, 10, 10], [5, 5, 10, 10], [1, 0], false],
  [[0, 0, 10, 10], [5, 5, 10, 10], [0, -1], false],
  [[0, 0, 10, 10], [5, 5, 10, 10], [0, 1], false],

  [[0, 0, 10, 10], [10, 0, 10, 10], [-1, 0], false],
  [[0, 0, 10, 10], [10, 0, 10, 10], [1, 0], true],
  [[0, 0, 10, 10], [10, 0, 10, 10], [0, -1], false],
  [[0, 0, 10, 10], [10, 0, 10, 10], [0, 1], false],

  [[0, 0, 10, 10], [-10, 0, 10, 10], [1, 0], false],
  [[0, 0, 10, 10], [-10, 0, 10, 10], [-1, 0], true],
  [[0, 0, 10, 10], [-10, 0, 10, 10], [0, -1], false],
  [[0, 0, 10, 10], [-10, 0, 10, 10], [0, 1], false],

  [[0, 0, 10, 10], [0, -10, 10, 10], [-1, 0], false],
  [[0, 0, 10, 10], [0, -10, 10, 10], [1, 0], false],
  [[0, 0, 10, 10], [0, -10, 10, 10], [0, -1], true],
  [[0, 0, 10, 10], [0, -10, 10, 10], [0, 1], false],

  [[0, 0, 10, 10], [0, 10, 10, 10], [-1, 0], false],
  [[0, 0, 10, 10], [0, 10, 10, 10], [1, 0], false],
  [[0, 0, 10, 10], [0, 10, 10, 10], [0, -1], false],
  [[0, 0, 10, 10], [0, 10, 10, 10], [0, 1], true],
];

const getAlignedPosData = [
  [[0, 5, 10, 10], [0, 0, 10, 10], [-1, -1], [-10, -10]], // r1, r2, vec, res
  [[0, 5, 10, 10], [0, 0, 10, 10], [-1, 0], [-10, 5]],
  [[0, 5, 10, 10], [0, 0, 10, 10], [-1, 1], [-10, 10]],

  [[0, 5, 10, 10], [0, 0, 10, 10], [0, -1], [0, -10]],
  [[0, 5, 10, 10], [0, 0, 10, 10], [0, 0], [0, 5]],
  [[0, 5, 10, 10], [0, 0, 10, 10], [0, 1], [0, 10]],

  [[0, 5, 10, 10], [0, 0, 10, 10], [1, -1], [10, -10]],
  [[0, 5, 10, 10], [0, 0, 10, 10], [1, 0], [10, 5]],
  [[0, 5, 10, 10], [0, 0, 10, 10], [1, 1], [10, 10]],
];

const willBeAlignedData = [
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 0], [0, 0], false], // r1, r2, targetPos, vec, res

  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -10], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -10], [0, 1], true],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -10], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -10], [1, 0], false],

  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 10], [0, -1], true],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 10], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 10], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 10], [1, 0], false],

  [[0, 0, 10, 10], [0, 0, 10, 10], [-10, 0], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [-10, 0], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [-10, 0], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [-10, 0], [1, 0], true],

  [[0, 0, 10, 10], [0, 0, 10, 10], [10, 0], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [10, 0], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [10, 0], [-1, 0], true],
  [[0, 0, 10, 10], [0, 0, 10, 10], [10, 0], [1, 0], false],

  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -11], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -11], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -11], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, -11], [1, 0], false],

  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 11], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 11], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 11], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [0, 11], [1, 0], false],

  [[0, 0, 10, 10], [0, 0, 10, 10], [11, 0], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [11, 0], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [11, 0], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [11, 0], [1, 0], false],

  [[0, 0, 10, 10], [0, 0, 10, 10], [-11, 0], [0, -1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [-11, 0], [0, 1], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [-11, 0], [-1, 0], false],
  [[0, 0, 10, 10], [0, 0, 10, 10], [-11, 0], [1, 0], false],
];

function testIntersectsVertically(data, t) {
  const answers = [
    true,
    true, true, true, true,
    true, true, true, true,
    true, false, true, false,
  ];
  data.forEach((tc, index) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const res = utils.intersectsVertically(r1, r2);
    t.equal(res, answers[index], `r1 ${tc[0]} intersects vertically r2 ${tc[1]}`);
  });
  t.end();
}

function testIntersectsHorizontally(data, t) {
  const answers = [
    true,
    true, true, true, true,
    true, true, true, true,
    false, true, false, true,
  ];
  data.forEach((tc, index) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const res = utils.intersectsHorizontally(r1, r2);
    t.equal(res, answers[index], `r1 ${tc[0]} intersects horizontally r2 ${tc[1]}`);
  });
  t.end();
}

function testAlignedTo(data, t) {
  data.forEach((tc) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const res = utils.alignedTo(r1, r2, new Phaser.Point(tc[2][0], tc[2][1]));
    t.equal(res, tc[3], `r1 ${tc[0]} is aligned to ${tc[1]} in ${tc[2]} direction`);
  });
  t.end();
}

function testGetAlignedPos(data, t) {
  data.forEach((tc) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const pos = utils.getAlignedPos(r1, r2, new Phaser.Point(tc[2][0], tc[2][1]));
    const areEqual = pos.equals(new Phaser.Point(tc[3][0], tc[3][1]));
    t.equal(areEqual, true, `r1 ${tc[0]} aligned to the r2 ${tc[1]} in ${tc[2]} direction,
has a position ${tc[3]}`);
  });
  t.end();
}

function testIntersects(data, t) {
  data.forEach((tc) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const res = utils.intersects(r1, r2);
    t.equal(res, tc[2], `r1 ${tc[0]} intersects r2 ${tc[1]}: ${tc[2]}`);
  });
  t.end();
}

function testWillIntersect(data, t) {
  data.forEach((tc) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const targetPos = new Phaser.Point(tc[2][0], tc[2][1]);
    const res = utils.willIntersect(r1, r2, targetPos);
    t.equal(res, tc[3], `r1 ${tc[0]} will intersect r2 ${tc[1]} after moving to ${tc[2]}: ${tc[3]}`);
  });
  t.end();
}

function testWillBeAligned(data, t) {
  data.forEach((tc) => {
    const r1 = new Phaser.Rectangle(tc[0][0], tc[0][1], tc[0][2], tc[0][3]);
    const r2 = new Phaser.Rectangle(tc[1][0], tc[1][1], tc[1][2], tc[1][3]);
    const targetPos = new Phaser.Point(tc[2][0], tc[2][1]);
    const vec = new Phaser.Point(tc[3][0], tc[3][1]);
    const res = utils.willBeAligned(r1, r2, targetPos, vec);
    t.equal(res, tc[4], `r1 ${tc[0]} will be aligned to ${tc[1]} in ${tc[3]} direction after moving to ${tc[2]}`);
  });
  t.end();
}

test('intersectsVertically', testIntersectsVertically.bind(null, intersectDirTestData));
test('intersectsHorizontally', testIntersectsHorizontally.bind(null, intersectDirTestData));
test('alignedTo', testAlignedTo.bind(null, alignmentTestData));
test('getAlignedPos', testGetAlignedPos.bind(null, getAlignedPosData));
test('intersects', testIntersects.bind(null, intersectTestData));
test('willIntersect', testWillIntersect.bind(null, willIntersectData));
test('willBeAligned', testWillBeAligned.bind(null, willBeAlignedData));
