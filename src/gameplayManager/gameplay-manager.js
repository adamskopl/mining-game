import { OBJECT_TYPE } from '../consts';

export const DIRECTION = {
  UP: 'DIR_UP',
  RIGHT: 'DIR_RIGHT',
  DOWN: 'DIR_DOWN',
  LEFT: 'DIR_LEFT',
};

export default {
  init(g) {
    this.g = g;
    this.mainGroup = null;
  },
  // when the main sprites group is reloaded
  onMainGroupReloaded(group) {
      this.mainGroup = group;
      const hero = group.children.find(c => c.type === OBJECT_TYPE.HERO);
  },
  onKeyDirection(direction) {
    switch (direction) {
      case DIRECTION.UP:
        break;
      case DIRECTION.RIGHT:
        break;
      case DIRECTION.DOWN:
        break;
      case DIRECTION.LEFT:
        break;
      default:
    }
  },
};
