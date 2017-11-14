/**
 * @return {number} field size
 */
export function getFieldSize([gameW, gameH] = [0, 0], [fieldsX, fieldsY] = [0, 0]) {
  // smaller one indicates which will be obligatory
  return Math.floor(Math.min(gameW / fieldsX, gameH / fieldsY));
}

export function levelPosToPos([levelX, levelY], [gameX, gameY], fieldSize) {
  return [gameX + (levelX * fieldSize), gameY + (levelY * fieldSize)];
}

/**
 * Get level dimensions in fields
 * @param {[[number]]} level array
 */
export function getLevelDim(level) {
  return [level[0].length, level.length];
}
