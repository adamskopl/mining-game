import * as objectUtils from 'src/object/utils';
import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from 'src/object/object-event';

export { getObjectsEventsForKeyDirection };

/**
 * @return {Array<GameObjectEvent>}
 */
function getObjectsEventsForKeyDirection(objectsFilled, dir, hero) {
  let gameObjectEvents = [];
  if (!hero.$isTweenRunning()) {
    gameObjectEvents = objectsFilled.map(
        forEveryFilled.bind(null, hero, dir),
      )
      .filter(x => x !== null);
  }
  return gameObjectEvents;
}

// TODO: always give a direction. eventually destroy the field

function forEveryFilled(h, d, filled) {
  let heroEvent = null;
  if (objectUtils.alignedTo(h.$rec, filled.$rec, d)) {
    heroEvent = createGameObjectEvent(
      GAME_OBJECT_EVENT_TYPE.DESTROY,
      filled,
    );
  }
  return heroEvent;
}
