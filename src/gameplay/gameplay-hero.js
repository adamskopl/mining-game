import * as objectUtils from 'src/object/utils';
import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from 'src/object/object-event';
import { MOVEMENT_TYPE } from 'src/object/object-move';

export { getObjectsEventsForKeyDirection };

/**
 * @return {Array<GameObjectEvent>}
 */
function getObjectsEventsForKeyDirection(
  objectsFilled, dir, gravVec, group, hero,
) {
  let gameObjectEvents = [];
  if (!hero.$isMoving() && !Phaser.Point.negative(gravVec).equals(dir)) {
    gameObjectEvents = gameObjectEvents.concat(
      objectsFilled.map(
        forEveryFilled.bind(null, hero, dir, group),
      ).filter(x => x !== null),
    );
    if (
      gameObjectEvents.length === 0 &&
      !gravVec.equals(dir) &&
      !hero.$isMovementSet()
    ) {
      gameObjectEvents.push(createGameObjectEvent(
        GAME_OBJECT_EVENT_TYPE.MOVE,
        hero,
        dir,
        MOVEMENT_TYPE.ONE,
      ));
    }
  }
  return gameObjectEvents;
}

function forEveryFilled(h, d, group, filled) {
  let heroEvent = null;
  if (objectUtils.alignedTo(h.$rec, filled.$rec, d)) {
    heroEvent = createGameObjectEvent(
      GAME_OBJECT_EVENT_TYPE.DESTROY,
      filled,
      group,
    );
  }
  return heroEvent;
}
