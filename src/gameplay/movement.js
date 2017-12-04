export function move(vec, fieldSize, object) {
  object.bringToTop();
  object.move([vec.x * fieldSize, vec.y * fieldSize]);
  // PUB: object started movement
}
