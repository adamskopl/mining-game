import { GRAV, handleGravity } from './gravity';
import { handleMovement } from './movement';
import { hasGround } from './utils';

export { update };

/**
 * @param {GameObject} o1
 * @param {Array<GameObject>} otherObjects
 * @param {number} fieldSize
 * @return {Array<GameObjectEvent>}
 */
function update(o1, otherObjects, fieldSize) {
  let objectsEvents = null;
  if (!hasGround(o1, otherObjects, GRAV.vec)) {
    objectsEvents = handleGravity(o1, otherObjects, fieldSize);
  } else {
    objectsEvents = handleMovement(o1, otherObjects, fieldSize);
  }
  return objectsEvents;
}
