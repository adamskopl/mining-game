import { checkArgs } from 'src/utils';

const Pnt = Phaser.Point;
const Rec = Phaser.Rectangle;
const Line = Phaser.Line;

/**
 * @param {Phaser.Rectangle} a
 * @param {Phaser.Rectangle} b
 * @returns {boolean} @a & @b are intersected by a vertical line.
 */
export function intersectsVertically(a, b) {
  checkArgs('intersectsVertically', arguments, ['rectangle', 'rectangle']);
  return (a.x <= b.x && a.right > b.x) ||
    (a.x >= b.x && a.x < b.right);
}

/**
 * @param {Phaser.Rectangle} a
 * @param {Phaser.Rectangle} b
 * @returns {boolean} @a & @b are intersected by a horizontal line.
 */
export function intersectsHorizontally(o1, o2) {
  checkArgs('alignedTo', arguments, ['rectangle', 'rectangle']);
  return (o1.y <= o2.y && o1.bottom > o2.y) ||
    (o1.y >= o2.y && o1.y < o2.bottom);
}

/**
 * @param {Phaser.Rectangle} a
 * @param {Phaser.Rectangle} b
 * @param {Phaser.Point} vec
 * @returns {boolean} @a is aligned to @b in a given direction (direction FROM
 * the @a)
 */
export function alignedTo(a, b, vec) {
  checkArgs('alignedTo', arguments, ['rectangle', 'rectangle', 'point']);
  if (vec.y === 1) {
    return (a.bottom === b.y) && intersectsVertically(a, b);
  }
  if (vec.x === 1) {
    return (a.right === b.x) && intersectsHorizontally(a, b);
  }
  if (vec.y === -1) {
    return (a.y === b.bottom) && intersectsVertically(a, b);
  }
  if (vec.x === -1) {
    return (a.x === b.right) && intersectsHorizontally(a, b);
  }
  console.error('$alignedTo wrong vec');
  return false;
}

/**
 *
 * @returns {Phaser.Point} position of the @a when aligned to the @b in the
 * given direction. When the coordinate is not set, it's not modified. E.g. [0,
 * -1] means align @a to the top of the @b, don't change the x coordinate.
 */
export function getAlignedPos(a, b, vec, offsetX = 0, offsetY = 0) {
  let [newX, newY] = [null, null];
  if (vec.x === 0) {
    newX = a.x;
  } else {
    newX = b.x + (vec.x * (vec.x === -1 ? a.width : b.width));
  }
  if (vec.y === 0) {
    newY = a.y;
  } else {
    newY = b.y + (vec.y * (vec.y === -1 ? a.height : b.height));
  }
  return new Pnt(newX + offsetX, newY + offsetY);
}

/**
 * Modified code from
 * https://github.com/photonstorm/phaser-ce/blob/v2.10.1/src/geom/Rectangle.js#L1027.
 * Aligned rectangles are not intersected.
 * @param {Phaser.Rectangle} a
 * @param {Phaser.Rectangle} b
 * @returns {boolean} @a is intersecting @b
 */
export function intersects(a, b) {
  checkArgs('willIntersect', arguments, ['rectangle', 'rectangle']);
  return !(a.right <= b.x || a.bottom <= b.y || a.x >= b.right || a.y >= b.bottom);
}

/**
 * @param {Phaser.Rectangle} a
 * @param {Phaser.Rectangle} b
 * @param {Phaser.Point} rec1TargetPos @a's target position
 * @returns {boolean} will @a intersesct @b after moving to the target position?
 */
export function willIntersect(a, b, rec1TargetPos) {
  checkArgs('willIntersect', arguments, ['rectangle', 'rectangle', 'point']);
  const newRec = new Rec(rec1TargetPos.x, rec1TargetPos.y, a.width,
    a.height);
  return intersects(b, newRec);
}

export function willBeAligned(a, b, targetPos, vec) {
  checkArgs('willBeAligned', arguments, ['rectangle', 'rectangle', 'point', 'point']);
  const newRec = new Rec(targetPos.x, targetPos.y, a.width,
    a.height);
  return alignedTo(newRec, b, vec);
}
