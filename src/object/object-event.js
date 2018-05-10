/**
 * Describing what can happen with an object. E.g. it can be destroyed.
 * @typedef {object} GameObjectEventType
 */
const GAME_OBJECT_EVENT_TYPE = {
  DESTROY: 'DESTROY', // destroy given object
};

export { GAME_OBJECT_EVENT_TYPE, createGameObjectEvent };

/**
 * Data about game object event.
 * @typedef {object} GameObjectEvent
 * @property {GameObjectEventType} eventType
 * @property {GameObject} object
 *
 * @param {GameObjectEventType} eventType
 * @param {GameObject} object
 * @return {GameObjectEvent}
 */
function createGameObjectEvent(eventType, object) {
  return {
    eventType,
    object,
  };
}
