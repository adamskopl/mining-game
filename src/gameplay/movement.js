import Phaser from 'phaser';
import { getNeighbor } from '../group-utils';
import { handleCollision } from './collisions';
import { checkArgs } from '../utils';

function moveObject(vec, fieldSize, object) {
  checkArgs('moveObject', arguments, ['object', 'number', 'object']); // eslint-disable-line prefer-rest-params
  object.bringToTop();
  object.move(new Phaser.Point(vec.x * fieldSize, vec.y * fieldSize));
  // PUB: object started movement
}

export default {
  move(vec, vecGravity, fieldSize, objects, group) {
    checkArgs('move', arguments, ['object', 'object', 'number', 'array', 'object']);
    // block movement negative to the gravity vec
    if (Phaser.Point.negative(vec).equals(vecGravity)) { return; }
    objects.filter(o => !o.isMoving()).forEach((o) => {
      const neighbor = getNeighbor(group, o, vec);
      if (neighbor) { handleCollision([neighbor, o]); }
      moveObject(vec, fieldSize, o);
    });
  },
};
