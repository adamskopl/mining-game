import { OBJECT_TYPE } from '../consts';

export const DIRECTION = {
  UP: 'DIR_UP',
  RIGHT: 'DIR_RIGHT',
  DOWN: 'DIR_DOWN',
  LEFT: 'DIR_LEFT',
};

const get = (group, type) => group.children.find(c => c.type === type);

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
    const hero = get(this.mainGroup, OBJECT_TYPE.HERO);
    hero.bringToTop();
    switch (direction) {
      case DIRECTION.UP:
        hero.y -= this.fieldSize;
        break;
      case DIRECTION.RIGHT:
        hero.x += this.fieldSize;
        break;
      case DIRECTION.DOWN:
        hero.y += this.fieldSize;
        break;
      case DIRECTION.LEFT:
        hero.x -= this.fieldSize;
        break;
      default:
    }
  },
};
