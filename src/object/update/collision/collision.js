import { GAME_OBJECT_TYPE } from 'src/consts';
import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent
} from '../../object-event';

export { getGameObjectEventsForCollision };

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
    f(objects, vecMoveN, vecGravN) {
      let [hero, filled] =
            makeSwap(objects[0], objects[1], GAME_OBJECT_TYPE.HERO);
      let res = [];
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
 * @param {GameObject} object colliding
 * @param {Array<GameObject>} objects colliding with the object
 * @param {Phaser.Point} vecMoveN move normalized vector for colliding object
 * @param {Phaser.Point} vecGravN gravity normalized vector during collision
 * @return {Array<GameObjectEvent>}
 */
function getGameObjectEventsForCollision(o, vecMoveN, vecGravN, objects) {
  return objects
    .map(getGameObjectEvent.bind(null, o, vecMoveN, vecGravN, HANDLERS))
    .reduce((acc, val) => acc.concat(val), []);
}

/**
 * @return Array<GameObjectEvent>
 */
function getGameObjectEvent(
  mainObject,
  vecMoveN,
  vecGravN,
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
    res = handler.f([mainObject, otherObject], vecMoveN, vecGravN);
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
