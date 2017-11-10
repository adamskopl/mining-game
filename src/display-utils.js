// import R from 'ramda';

// terms.
// app area: where the whole application is rendered
// game area: where the gameplay is rendered

/**
 * @param {number} appW  app's width
 * @param {number} appH
 * @param {float} marginH  (0.0f..1.0f) marginH horizontal margin from one side
 * (percent). e,g 0.2 means (0.2*appW) from the left and (0.2*appW) from the
 * right
 * @param {float} marginH
 * @return {number[]} dimensions of the game area. null for wrong args.
 */
export function getGameAreaSize([appW, appH] = [0, 0], [marginX, marginY] = [0, 0]) {
  const wrongArg = a => a < 0;
  if ([appW, appH, marginX, marginY].find(wrongArg)) {
    return null;
  }
  return [appW - (appW * marginX * 2), appH - (appH * marginY * 2)];
}

/**
 * @param {number} appW app's width
 * @param {number} gameAreaW game's area width
 * @return {number[]} x, y of the centered game area. null for wrong args.
 */
export function getGameAreaPos([appW, appH] = [0, 0], [gameAreaW, gameAreaH] = [0, 0]) {
  const wrongArg = a => a < 0;
  if ([appW, appH, gameAreaW, gameAreaH].find(wrongArg) ||
      appW < gameAreaW || appH < gameAreaH) {
    return null;
  }
  return [(appW - gameAreaW) / 2, (appH - gameAreaH) / 2];
}
