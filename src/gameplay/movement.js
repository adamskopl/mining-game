export function move(vec, fieldSize, object) {
  object.bringToTop();
  object.move([vec[0] * fieldSize, vec[1] * fieldSize]);
}
