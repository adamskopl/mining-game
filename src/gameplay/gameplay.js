import Phaser from 'phaser';
import R from 'ramda';
import { OBJECT_TYPE } from '../consts';
import movement from './movement';
import { getNeighbor } from '../group-utils';
import { checkArgs } from '../utils';

// TODO: change to Phaser.Point. will allow to make calculations, etc...
export const DIRECTION = {
  UP: 'DIR_UP',
  RIGHT: 'DIR_RIGHT',
  DOWN: 'DIR_DOWN',
  LEFT: 'DIR_LEFT',
};

export const DIRECTIONS = [DIRECTION.UP, DIRECTION.RIGHT, DIRECTION.DOWN, DIRECTION.LEFT];

const VEC_GRAVITY = new Phaser.Point(0, 1);

// TODO: move to the phaser group? e.g. group.filter(). Array methods in a group.
const groupFilterTypes = (group, types) => group.children.filter(c => types.includes(c.type));
const groupFilter = (group, test) => group.children.filter(test);

export default {
  init(g) {
    this.g = g;
    this.mainGroup = null;
    this.fieldSize = 0;
  },
  // when the main sprites group is reloaded
  onMainGroupReloaded(group) {
    this.mainGroup = group;
  },
  onFieldResized(fieldSize) {
    this.fieldSize = fieldSize;
    const enemies = groupFilterTypes(this.mainGroup, [OBJECT_TYPE.ENEMY]);
    enemies[1].x += this.fieldSize / 2;
  },
  onKeyDirection(direction) {
    const vec = new Phaser.Point();
    switch (direction) {
      case DIRECTION.UP:
        vec.set(0, -1);
        break;
      case DIRECTION.RIGHT:
        vec.set(1, 0);
        break;
      case DIRECTION.DOWN:
        vec.set(0, 1);
        break;
      case DIRECTION.LEFT:
        vec.set(-1, 0);
        break;
      default:
    }
    this.move(vec, VEC_GRAVITY);
  },
  move(vec, vecGravity) {
    checkArgs('move', arguments, ['object', 'object']);
    const heroes = groupFilterTypes(this.mainGroup, [OBJECT_TYPE.HERO]);
    movement.moveObjects(vec, vecGravity, this.fieldSize, heroes, this.mainGroup);
  },
  update() {
    if (!this.mainGroup) { return; }

    // old GRAV implementation
    // const testMovable = testedO => [R.propEq('movable', true), o => !o.isMoving()].every(f => f(testedO));
    // const movable = groupFilter(this.mainGroup, testMovable);
    // movable.forEach((m) => {
    //   const neighbor = getNeighbor(this.mainGroup, m, VEC_GRAVITY);
    //   if (!neighbor) {
    //     // TODO: implement gravity: move when no floor
    //     // move(GRAVITY_VEC, this.fieldSize, m);
    //   }
    // });
  },
};
