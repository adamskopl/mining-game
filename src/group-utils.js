/**
 * @param x, y {number} {-1, 0, 1} indicating neighbor
 * assumptions: all sprites in group have size of a passed object
 */
export function getNeighbor(group, object, vec) {
  const size = object.width;
  return group.children.find(ch => (
    (ch.x === object.x + (vec.x * size)) &&
      (ch.y === object.y + (vec.y * size))));
}
