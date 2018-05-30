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

function createHandler(typeA, typeB, foo) {
  return {
    types: [typeA, typeB],
    handle(oA, oB, vecMoveN) {
      const [a, b] = makeSwap(oA, oB, oA.$type);
      return foo(a, b, vecMoveN);
    },
  };
}

function handlerDefault(objA, objB, vecMoveN) {
  const res = [];
  res.push(createGameObjectEvent(
    GAME_OBJECT_EVENT_TYPE.ALIGN,
    objA,
    objB,
    Phaser.Point.negative(vecMoveN),
  ));
  return res;
}

const HANDLERS = [
  createHandler(
    GAME_OBJECT_TYPE.HERO,
    GAME_OBJECT_TYPE.FILLED,
    function foo(hero, filled, vecMoveN) {
      const res = [];
      return res;
    },
  ),
  createHandler(
    GAME_OBJECT_TYPE.FRIEND,
    GAME_OBJECT_TYPE.FILLED,
    function foo(friend, filled, vecMoveN) {
      const res = [];
      return res;
    },
  ),
  createHandler(
    GAME_OBJECT_TYPE.HERO,
    GAME_OBJECT_TYPE.FRIEND,
    function foo(hero, friend, vecMoveN) {
      const res = [];
      return res;
    },
  ),
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
    res = res.concat(handler.handle(mainObject, otherObject, vecMoveN));
  } else {
    debugError(`no handler for ${mainObject.$type}, ${otherObject.$type}`);
  }
  res = res.concat(handlerDefault(mainObject, otherObject, vecMoveN));
  return res;
}

function handlerMatches(objectA, objectB, h) {
  return (
    h.types.includes(objectA.$type) &&
    h.types.includes(objectB.$type)
  );
}
