// Determining {GameObjectEvent} when leaving other object during the movement.
import { checkArgs } from 'src/utils';
import { MOVEMENT_TYPE } from 'src/object/object-move';
import {
  GAME_OBJECT_EVENT_TYPE,
  createGameObjectEvent,
} from '../../object-event';
import { getAlignVecWhenLeavingObject } from '../utils';

export { getGameObjectEventsForLeave };

/**
 * @param {GameObject|null} objectGravAligned object aligned to the @objectLeaving in
 * the direction of the the gravity (or no object)
 */
function getGameObjectEventsForLeave(
  objectLeaving, objectLeft, objectGravAligned, vecMoveN, vecGravN,
) {
  checkArgs('getGameObjectEventsForLeave', arguments, [
    'object',
    'object',
    'object',
    'point',
    'point',
  ]);
  const res = [];
  if (
    objectGravAligned === null || // no ground, movement type does not matter
    objectLeaving.$getMovement().type === MOVEMENT_TYPE.ONE
  ) {
    res.push(createGameObjectEvent(
      GAME_OBJECT_EVENT_TYPE.ALIGN,
      objectLeaving,
      objectLeft,
      getAlignVecWhenLeavingObject(vecMoveN, vecGravN),
    ));
  }
  return res;
}
