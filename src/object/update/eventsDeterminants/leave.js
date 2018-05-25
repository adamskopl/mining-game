// Determining {GameObjectEvent} when leaving other object during the movement.
import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from '../../object-event';
import { MOVEMENT_TYPE } from 'src/object/object-move';
import { getAlignVecWhenLeavingObject } from '../utils';

export { getGameObjectEventsForLeave };

function getGameObjectEventsForLeave(
  objectLeaving, objectLeft, vecMoveN, vecGravN,
) {
  const res = [];
  if (objectLeaving.$getMovement().type === MOVEMENT_TYPE.ONE) {
    res.push(createGameObjectEvent(
      GAME_OBJECT_EVENT_TYPE.ALIGN,
      objectLeaving,
      objectLeft,
      getAlignVecWhenLeavingObject(vecMoveN, vecGravN),
    ));
  }
  return res;
}
