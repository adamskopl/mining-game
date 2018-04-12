// /**
//  * ?? what it does. doc.
//  * @return {number} field size
//  */
// export function getFieldSizeOld([gameW, gameH] = [0, 0], [fieldsX, fieldsY] = [0, 0]) {
//   // smaller one indicates which will be obligatory
//   return Math.floor(Math.min(gameW / fieldsX, gameH / fieldsY));
// }

/**
 * @param {Phaser.Point} game's dimensions (XxY)
 * @param {Phaser.Point} how many fields
 * @return {number} field size
 */
export function getFieldSize(gameRes, fieldsNum) {
  // smaller one indicates which will be obligatory
  return Math.floor(Math.min(gameRes.x / fieldsNum.x, gameRes.y / fieldsNum.y));
}
