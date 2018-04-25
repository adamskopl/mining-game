import * as utils from '../utils';
import { GRAV, handleGravity } from './gravity';
import { handleMovement } from './movement';
import { createTweenObj, hasGround } from './utils';

export { update };

function update(o1, objects, fieldSize) {
  if (!hasGround(o1, objects, GRAV.vec)) {
    handleGravity(o1, objects, fieldSize);
  } else {
    handleMovement(o1, objects, fieldSize);
  }
}
