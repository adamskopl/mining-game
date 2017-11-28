import { OBJECT_TYPE } from '../consts';
import { getNeighbour } from '../group-utils';

export function move(vec, group, fieldSize, object) {
  const neighbor = getNeighbour(group, object, vec);
  if (neighbor && neighbor.type === OBJECT_TYPE.FILLED) { neighbor.destroy(); }
  object.bringToTop();
  object.move([vec[0] * fieldSize, vec[1] * fieldSize]);
}
