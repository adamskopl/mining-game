import { OBJECT_TYPE } from '../consts';
import movement from './movement';
import { checkArgs } from '../utils';

// TODO: move to the phaser group? e.g. group.filter(). Array methods in a group.
const groupFilterTypes = (group, types) => group.children.filter(c => types.includes(c.$type));
const groupFilter = (group, test) => group.children.filter(test);

export default {
  init(g) {
    this.g = g;
    this.mainGroup = null;
    this.gameSize = null;
  },
  // when the main sprites group is reloaded
  onMainGroupReloaded(mainGroup) {
    this.mainGroup = mainGroup;

    // enable gravity for some types
    groupFilterTypes(this.mainGroup, [OBJECT_TYPE.HERO, OBJECT_TYPE.ENEMY])
      .forEach((o) => {
        o.$enableGravity();
      });
  },
  onKeyDirection(direction) {
    // const vec = new Phaser.Point();
    // switch (direction) {
    //   case DIRECTION.UP:
    //     vec.set(0, -1);
    //     break;
    //   case DIRECTION.RIGHT:
    //     vec.set(1, 0);
    //     break;
    //   case DIRECTION.DOWN:
    //     vec.set(0, 1);
    //     break;
    //   case DIRECTION.LEFT:
    //     vec.set(-1, 0);
    //     break;
    //   default:
    // },
    // this.move(vec, VEC_GRAVITY);
  },
  /**
   * @param {Phaer.Point} gameSize
   */
  onResize(gameSize) {
    this.gameSize = gameSize;
  },
  move(vec, vecGravity) {
    // checkArgs('move', arguments, ['object', 'object']);
    // const heroes = groupFilterTypes(this.mainGroup, [OBJECT_TYPE.HERO]);
    // movement.moveObjects(vec, vecGravity, this.fieldSize, heroes, this.mainGroup);
  },
  update() {
    if (!this.gameSize || !this.mainGroup) {
      return;
    }
    this.mainGroup.children.forEach((o) => {
      o.$update(this.mainGroup.children.filter(x => x !== o), this.gameSize);
    });
  },
};
