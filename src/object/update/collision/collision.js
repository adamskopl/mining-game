import { GAME_OBJECT_TYPE } from 'src/consts';
import { GAME_OBJECT_EVENT_TYPE, createGameObjectEvent } from '../../object-event';

export { getGameObjectEventsForCollision };

/*
 TODO: need factory of handlers.. too much duplication
 */
const HANDLERS = [{
    objects: [GAME_OBJECT_TYPE.HERO, GAME_OBJECT_TYPE.FILLED],
    f(objects) {
      let [hero, filled] = objects,
      res = null;
      // TODO: args swap function
      if (hero.type === GAME_OBJECT_TYPE.FILLED) {
        [hero, filled] = [objects[1], objects[0]];
      }
      // should return an array of the GAME_OBJECT_EFFECT
      // return createGameObjectEvent(GAME_OBJECT_EVENT_TYPE.DESTROY, filled);

      return res;
    },
  },
  {
    objects: [GAME_OBJECT_TYPE.HERO, GAME_OBJECT_TYPE.EMPTY],
    f(objects) {
      let [hero, empty] = objects,
      res = null;
      // TODO: args swap function
      if (hero.type === GAME_OBJECT_TYPE.EMPTY) {
        [hero, empty] = [objects[1], objects[0]];
      }
      return res;
    },
  },
];

/**
 * @param {GameObject} object colliding
 * @param {Array<GameObject>} objects colliding with the object
 * @return {Array<GameObjectEvent>}
 */
function getGameObjectEventsForCollision(o, objects) {
  return objects.map(getGameObjectEvent.bind(null, HANDLERS, o))
    .filter(x => x !== null);
}

/**
 * @return {GameObjectEvent}
 */
function getGameObjectEvent(handlers, mainObject, otherObject) {
  let res = null;
  const handler = handlers.find(handlerMatches.bind(
    null,
    mainObject,
    otherObject,
  ));
  if (handler) {
    res = handler.f([mainObject, otherObject]);
  } else {
    console.error('no handler for ', mainObject.$type, otherObject.$type);
  }
  return res;
}

function handlerMatches(objectA, objectB, h) {
  return (
    h.objects.includes(objectA.$type) &&
    h.objects.includes(objectB.$type)
  );
}
