import * as objectUtils from 'src/object/utils';
import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from 'src/object/object-event';

export { getObjectsEventsForKeyDirection };

/**
 * @return {Array<GameObjectEvent>}
 */
function getObjectsEventsForKeyDirection(objectsFilled, dir, group, hero) {
  let gameObjectEvents = [];
  if (!hero.$isTweenRunning()) {
    gameObjectEvents = objectsFilled
      .map(forEveryFilled.bind(null, hero, dir, group))
      .filter(x => x !== null);
    gameObjectEvents.push(createGameObjectEvent(
      GAME_OBJECT_EVENT_TYPE.MOVE,
      hero,
      dir,
    ));
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
