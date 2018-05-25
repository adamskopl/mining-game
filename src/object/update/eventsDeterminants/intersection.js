// Determining {GameObjectEvent} when intersection with other objects occur
// during the movement.
import { checkArgs } from 'src/utils';
import { GAME_OBJECT_TYPE } from 'src/consts';
import { debugError } from 'src/utils';

import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from '../../object-event';

export { getGameObjectEventsForIntersection };

function makeSwap(a, b, firstType) {
  let ret = [a, b];
  if (b.type === firstType) {
    ret = [b, a];
  }
  return ret;
}

/*
 TODO: need factory of handlers.. too much duplication
 */
const HANDLERS = [
  {
    objects: [GAME_OBJECT_TYPE.HERO, GAME_OBJECT_TYPE.FILLED],
    f(objects, vecMoveN) {
      let [hero, filled] =
            makeSwap(objects[0], objects[1], GAME_OBJECT_TYPE.HERO);
      const res = [];
      // TODO: args swap function
      if (hero.type === GAME_OBJECT_TYPE.FILLED) {
        [hero, filled] = [objects[1], objects[0]];
      }
      res.push(createGameObjectEvent(
        GAME_OBJECT_EVENT_TYPE.ALIGN,
        hero,
        filled,
        Phaser.Point.negative(vecMoveN),
      ));
      return res;
    },
  },
];

/**
 * @param {GameObject} object intersecting
 * @param {Array<GameObject>} objects intersecting with the object
 * @param {Phaser.Point} vecMoveN move normalized vector for intersecting object
 * @return {Array<GameObjectEvent>}
 */
function getGameObjectEventsForIntersection(o, vecMoveN, objects) {
  checkArgs('getGameObjectEventsForIntersection', arguments, [
    'object',
    'point',
    'array',
  ]);
  return objects
    .map(getGameObjectEvent.bind(null, o, vecMoveN, HANDLERS))
    .reduce((acc, val) => acc.concat(val), []);
}

/**
 * @return Array<GameObjectEvent>
 */
function getGameObjectEvent(
  mainObject,
  vecMoveN,
  handlers,
  otherObject,
) {
  let res = [];
  const handler = handlers.find(handlerMatches.bind(
    null,
    mainObject,
    otherObject,
  ));
  if (handler) {
    res = handler.f([mainObject, otherObject], vecMoveN);
  } else {
    debugError('no handler for ', mainObject.$type, otherObject.$type);
  }
  return res;
}

function handlerMatches(objectA, objectB, h) {
  return (
    h.objects.includes(objectA.$type) &&
    h.objects.includes(objectB.$type)
  );
}
