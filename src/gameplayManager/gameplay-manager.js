import { OBJECT_TYPE } from '../consts';

export const DIRECTION = {
  UP: 'DIR_UP',
  RIGHT: 'DIR_RIGHT',
  DOWN: 'DIR_DOWN',
  LEFT: 'DIR_LEFT',
};

const get = (group, type) => group.children.find(c => c.type === type);
const getAll = (group, type) => group.children.filter(c => c.type === type);

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
  },
  onKeyDirection(direction) {
    const heroes = getAll(this.mainGroup, OBJECT_TYPE.HERO);
    let vec = null;
    switch (direction) {
      case DIRECTION.UP:
        vec = [0, -this.fieldSize];
        break;
      case DIRECTION.RIGHT:
        vec = [this.fieldSize, 0];
        break;
      case DIRECTION.DOWN:
        vec = [0, this.fieldSize];
        break;
      case DIRECTION.LEFT:
        vec = [-this.fieldSize, 0];
        break;
      default:
    }
    heroes.forEach((h) => {
      h.bringToTop();
      h.move(vec);
    });
  },
};
