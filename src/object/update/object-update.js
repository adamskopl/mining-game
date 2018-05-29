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
function update(o, otherObjects, fieldSize) {
  let objectsEvents = [];
  if (!hasGround(o, otherObjects, GRAV.vec)) {
    objectsEvents = handleGravity(o, otherObjects, fieldSize);
  } else {
    objectsEvents = handleMovement(o, otherObjects, fieldSize);
  }
  return objectsEvents;
}
