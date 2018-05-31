// Determining {GameObjectEvent} when intersection with other objects occur
// during the movement.
import { checkArgs, debugError } from 'src/utils';
import { GAME_OBJECT_TYPE } from 'src/consts';

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

    handle(oA, oB, vecGrav) {
      const [a, b] = makeSwap(oA, oB, oA.$type);
      return foo(a, b, vecGrav);
    },
  };
}

function handlerDefault(objA, objB, vecGrav) {
  const res = [];
  const { vecMoveN } = objA.$getMovement();
  res.push(createGameObjectEvent(
    GAME_OBJECT_EVENT_TYPE.ALIGN,
    objA,
    objB,
    Phaser.Point.negative(vecMoveN),
  ));
  if (vecMoveN.equals(vecGrav)) {}
  return res;
}

const HANDLERS = [
  createHandler(
    GAME_OBJECT_TYPE.HERO,
    GAME_OBJECT_TYPE.FILLED,
    function foo(hero, filled, vecGrav) {
      const res = [];
      return res;
    },
  ),
  createHandler(
    GAME_OBJECT_TYPE.FRIEND,
    GAME_OBJECT_TYPE.FILLED,
    function foo(friend, filled, vecGrav) {
      const res = [];
      return res;
    },
  ),
  createHandler(
    GAME_OBJECT_TYPE.HERO,
    GAME_OBJECT_TYPE.FRIEND,
    function foo(hero, friend, vecGrav) {
      const res = [];
      return res;
    },
  ),
];

/**
 * @param {GameObject} object intersecting
 * @param {Array<GameObject>} objects intersecting with the object
 * @return {Array<GameObjectEvent>}
 */
function getGameObjectEventsForIntersection(o, objects, vecGrav) {
  checkArgs('getGameObjectEventsForIntersection', arguments, [
    'object',
    'array',
    'point',
  ]);
  return objects
    .map(getGameObjectEvent.bind(null, o, vecGrav, HANDLERS))
    .reduce((acc, val) => acc.concat(val), []);
}

/**
 * @return Array<GameObjectEvent>
 */
function getGameObjectEvent(
  mainObject,
  vecGrav,
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
    res = res.concat(handler.handle(
      mainObject,
      otherObject,
      vecGrav,
    ));
  } else {
    debugError(`no handler for ${mainObject.$type}, ${otherObject.$type}`);
  }
  res = res.concat(handlerDefault(
    mainObject,
    otherObject,
    vecGrav,
  ));
  return res;
}

function handlerMatches(objectA, objectB, h) {
  return (
    h.types.includes(objectA.$type) &&
    h.types.includes(objectB.$type)
  );
}
