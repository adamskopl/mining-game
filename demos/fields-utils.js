import R from 'ramda';
import { checkArgs } from './utils';

const Pnt = Phaser.Point;

export function findNeighbour(gFields, direction, field) {
  checkArgs('findNeighbour', arguments, ['object', 'point', 'object']);

  function cmprFun(f, dir, neigbour) {
    checkArgs('cmprFun', [f, dir, neigbour], ['object', 'point', 'object']);
    return (f.x + (dir.x * f.width) === neigbour.x) &&
      (f.y + (dir.y * f.height) === neigbour.y);
  }
  return gFields.children.find(cmprFun.bind(null, field, direction));
}

/**
 * E.g all fields with the y coord shifted by direction vec from the field coord.
 */
export function filterCoordDiff(field, direction, gFields) {
  checkArgs('filterCoordDiff', arguments, ['object', 'point', 'object']);

  function testFun(f, dir, gF) {
    const getCond = (f, dir, gF, keyCoord, keyDim) =>
      dir[keyCoord] === 0 || // 0 disables coord from being considered
      f[keyCoord] + (dir[keyCoord] * f[keyDim]) === gF[keyCoord];
    return [
      getCond(f, dir, gF, 'x', 'width'),
      getCond(f, dir, gF, 'y', 'height'),
    ].every(e => e === true);
  }
  return gFields.children.filter(testFun.bind(null, field, direction));
}

// is the oB on the side indicated by the direction
const isInDirection = (oA, dir, oB) => dir.x < 0 ? oA.x > oB.x : oA.x < oB.x;

export function findEdgeField(movingObject, direction, groupFields) {
  checkArgs('findEdgeField', arguments, ['object', 'point', 'object']);
  const fieldsNoNeighbour = filterCoordDiff(movingObject, new Pnt(0, 1), groupFields)
    .filter(f => !findNeighbour(groupFields, direction, f))
    .filter(isInDirection.bind(null, movingObject, direction));
  if (fieldsNoNeighbour.length === 0) {
    return null;
  }
  return fieldsNoNeighbour.reduce((direction.x < 0 ? R.maxBy : R.minBy)(a => a.x));
}
