import { debugError } from 'src/utils';

/**
 * Describing what can happen with an object. E.g. it can be destroyed.
 * @typedef {object} GameObjectEventType
 */
const GAME_OBJECT_EVENT_TYPE = {
  DESTROY: 'DESTROY', // destroy given object
  MOVE: 'MOVE',
  ALIGN: 'ALIGN', // align to the other game object, stop the movement
};

export { GAME_OBJECT_EVENT_TYPE, createGameObjectEvent };

const FACTORIES = new Map([
  [GAME_OBJECT_EVENT_TYPE.DESTROY, createGameObjectEventDestroy],
  [GAME_OBJECT_EVENT_TYPE.MOVE, createGameObjectEventMove],
  [GAME_OBJECT_EVENT_TYPE.ALIGN, createGameObjectEventAlign],
]);

const base = {
  initBase(object) {
    this.object = object;
  },
  resolve() {
    debugError('not implemented');
  },
};

const destroy = Object.assign(
  {},
  base,
  {
    init(object, group) {
      this.initBase(object);
      this.group = group;
    },
    resolve() {
      this.group.remove(this.object);
    },
  },
);

const move = Object.assign(
  {},
  base,
  {
    /**
     * @param {GameObjectMovement} movementObject
     */
    init(object, dir, movType) {
      this.initBase(object);
      [this.dir, this.movType] = [dir, movType];
    },
    resolve() {
      this.object.$setMovement(this.dir, this.movType);
    },
  },
);

const align = Object.assign(
  {},
  base,
  {
    init(object, alignTo, alignVec) {
      this.initBase(object);
      this.alignTo = alignTo;
      this.alignVec = alignVec;
    },
    resolve() {
      this.object.$alignTo(
        this.alignTo,
        this.alignVec,
        0,
        0,
      );
      this.object.$stopMovement();
    },
  },
);

/**
 * Data about game object event.
 * @typedef {object} GameObjectEvent
 * @property {GameObjectEventType} type
 * @property {GameObject} object
 *
 * @param {GameObjectEventType} type
 * @param {GameObject} object
 * @return {GameObjectEvent}
 */
function createGameObjectEvent(type, object, ...extra) {
  // MAP OF FUNCTIONS: <type, function>
  return FACTORIES.get(type)(object, ...extra);
}

function createGameObjectEventDestroy(o, ...extra) {
  const ret = Object.create(destroy);
  ret.init(o, ...extra);
  return ret;
}

function createGameObjectEventMove(o, ...extra) {
  const ret = Object.create(move);
  ret.init(o, ...extra);
  return ret;
}

function createGameObjectEventAlign(o, ...extra) {
  const ret = Object.create(align);
  ret.init(o, ...extra);
  return ret;
}
