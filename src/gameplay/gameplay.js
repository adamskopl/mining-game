import { OBJECT_TYPE } from '../consts';
import { checkArgs } from '../utils';

// TODO: move to the phaser group? e.g. group.filter(). Array methods in a group.
const groupFilterTypes = (group, types) => group.children.filter(c => types.includes(c.$type));
const groupFilter = (group, test) => group.children.filter(test);

export default {
  init(g) {
    this.g = g;
    this.mainGroup = null;
    this.fieldSize = null;
  },
  // when the main sprites group is reloaded
  onMainGroupReloaded(mainGroup) {
    this.mainGroup = mainGroup;

    // enable gravity for some types
    groupFilterTypes(this.mainGroup, [OBJECT_TYPE.HERO, OBJECT_TYPE.FRIEND])
      .forEach(function (o) {
        o.$enableGravity();
      });
  },
  onKeyDirection(direction) {
    groupFilterTypes(this.mainGroup, [OBJECT_TYPE.HERO])
      .forEach(function (o) {
        if (!o.$isTweenRunning()) {
          o.$setMoveVec(direction);
        }
      });
  },
  onFieldResized(fieldSize) {
    this.fieldSize = fieldSize;
  },
  update() {
    if (!this.mainGroup) {
      return;
    }
    this.mainGroup.children.forEach((o) => {
      o.$update(this.mainGroup.children.filter(x => x !== o), this.fieldSize);
    });
  },
};
