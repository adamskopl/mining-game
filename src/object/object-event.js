import { debugError } from 'src/utils';

/**
 * Describing what can happen with an object. E.g. it can be destroyed.
 * @typedef {object} GameObjectEventType
 */
const GAME_OBJECT_EVENT_TYPE = {
  DESTROY: 'DESTROY', // destroy given object
  MOVE: 'MOVE',
  ALIGN: 'ALIGN', // align to the other game object, stop the movement
  STOP: 'STOP', // stop the movement
};

const GAME_OBJECT_EVENT_TYPE_KEYS = Object.keys(GAME_OBJECT_EVENT_TYPE);

export { GAME_OBJECT_EVENT_TYPE, createGameObjectEvent };

const base = {
  initBase(object) {
    this.object = object;
  },
  resolve() {
    debugError('not implemented');
  },
};

const destroy = Object.assign({},
  base, {
    init(object, group) {
      this.initBase(object);
      this.group = group;
    },
    resolve() {
      this.group.remove(this.object);
    },
  });

const move = Object.assign({},
  base, {
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
  });

const align = Object.assign({},
  base, {
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
  });

const stop = Object.assign({},
  base, {
    init(object) {
      this.initBase(object);
    },
    resolve() {
      this.object.$stopMovement();
    },
  });

const TYPE_TO_OBJECT = new Map([
  [GAME_OBJECT_EVENT_TYPE.DESTROY, destroy],
  [GAME_OBJECT_EVENT_TYPE.MOVE, move],
  [GAME_OBJECT_EVENT_TYPE.ALIGN, align],
  [GAME_OBJECT_EVENT_TYPE.STOP, stop],
]);

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
  if (!GAME_OBJECT_EVENT_TYPE_KEYS
    .find(k => GAME_OBJECT_EVENT_TYPE[k] === type)) {
    debugError(`no "${type}" game object event type`);
  }
  const ret = Object.create(TYPE_TO_OBJECT.get(type));
  ret.init(object, ...extra);
  return ret;
}
