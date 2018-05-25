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
  initBase(type, object) {
    this.type = type;
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
    init(type, object, group) {
      this.initBase(type, object);
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
    init(type, object, movementObject) {
      this.initBase(type, object);
      this.movementObject = movementObject;
    },
    resolve() {
      this.object.$setMovement(this.movementObject);
    },
  },
);

const align = Object.assign(
  {},
  base,
  {
    init(type, object, alignTo, alignVec) {
      this.initBase(type, object);
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
  return FACTORIES.get(type)(type, object, ...extra);
}

function createGameObjectEventDestroy(type, o, ...extra) {
  const ret = Object.create(destroy);
  ret.init(type, o, ...extra);
  return ret;
}

function createGameObjectEventMove(type, o, ...extra) {
  const ret = Object.create(move);
  ret.init(type, o, ...extra);
  return ret;
}

function createGameObjectEventAlign(type, o, ...extra) {
  const ret = Object.create(align);
  ret.init(type, o, ...extra);
  return ret;
}
