import Phaser from 'phaser';
import R from 'ramda';
import { OBJECT_TYPE } from '../consts';
import { getNeighbor } from '../group-utils';
import { move } from './movement';
import { handleCollision } from './collisions';

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
    const heroes = groupFilterTypes(this.mainGroup, [OBJECT_TYPE.HERO]);
    // block movement negative to the gravity vec
    if (!Phaser.Point.negative(vec).equals(vecGravity)) {
      heroes.filter(h => !h.moving).forEach((h) => {
        const neighbor = getNeighbor(this.mainGroup, h, vec);
        if (neighbor) { handleCollision([neighbor, h]); }
        move(vec, this.fieldSize, h);
      });
    }
  },
  onTick() {
    if (!this.mainGroup) { return; }

    const testMovable = testedO => [R.propEq('movable', true), o => !o.isMoving()].every(f => f(testedO));
    const movable = groupFilter(this.mainGroup, testMovable);
    movable.forEach((m) => {
      const neighbor = getNeighbor(this.mainGroup, m, VEC_GRAVITY);
      if (!neighbor) {
        // move(GRAVITY_VEC, this.fieldSize, m);
      }
    });
  },
};
