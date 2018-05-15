/**
 * Describing what can happen with an object. E.g. it can be destroyed.
 * @typedef {object} GameObjectEventType
 */
const GAME_OBJECT_EVENT_TYPE = {
  DESTROY: 'DESTROY', // destroy given object
  MOVE: 'MOVE',
};

export { GAME_OBJECT_EVENT_TYPE, createGameObjectEvent };

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
function createGameObjectEvent(type, object) {
  // USE COMPOSITION: different types of events
  return {
    type,
    object,
  };
}
