import Phaser from 'phaser-ce';
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
    const getCond = (f2, dir2, gF2, keyCoord, keyDim) =>
      dir2[keyCoord] === 0 || // 0 disables coord from being considered
      f2[keyCoord] + (dir2[keyCoord] * f2[keyDim]) === gF2[keyCoord];
    return [
      getCond(f, dir, gF, 'x', 'width'),
      getCond(f, dir, gF, 'y', 'height'),
    ].every(e => e === true);
  }
  return gFields.children.filter(testFun.bind(null, field, direction));
}

// is the oB on the side indicated by the direction
export function isInDirection(oA, dir, oB) {
  const prop = dir.x !== 0 ? 'x' : 'y';
  return dir[prop] < 0 ? oA[prop] >= oB[prop] : oA[prop] <= oB[prop];
}

export function findEdgeField(movingObject, direction, gravity, groupFields) {
  checkArgs('findEdgeField', arguments, ['object', 'point', 'point', 'object']);
  const fieldsCoord = filterCoordDiff(movingObject, Pnt.normalize(gravity), groupFields);
  const fieldsNoN = fieldsCoord.filter(f => !findNeighbour(groupFields, direction, f));
  const fieldsInDir = fieldsNoN.filter(isInDirection.bind(null, movingObject, direction));

  if (fieldsInDir.length === 0) {
    return null;
  }
  const prop = direction.x !== 0 ? 'x' : 'y';
  return fieldsInDir.reduce((direction[prop] < 0 ? R.maxBy : R.minBy)(a => a[prop]));
}
