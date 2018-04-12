import { checkArgs } from 'src/utils';

// terms.
// app area: where the whole application is rendered
// game: where the gameplay is rendered

/**
 * @param {Phaser.Point} appRes
 * @param {Phaser.Point} margins (values from 0.0f to 1.0f) margin from one side
 * (percent). e,g 0.2 means (0.2*appW) from the left and (0.2*appW) from the
 * right
 * @return {Phaser.Point} dimensions of the game area. null for wrong args.
 */
export function getGameAreaSize(appRes, margins) {
  checkArgs('getGameAreaSize', arguments, ['point', 'point']);
  const wrongArg = a => a < 0;
  if ([appRes.x, appRes.y, margins.x, margins.y].find(wrongArg)) {
    return null;
  }
  return new Phaser.Point(
    appRes.x - (appRes.x * margins.x * 2),
    appRes.y - (appRes.y * margins.y * 2),
  );
}

/**
 * Get the position of the game area for the given app and game resolution.
 * @param {Phaser.Point} appRes
 * @param {Phaser.Point} gameRes
 * @return {Phaser.Point}
 */
export function getGamePos(appRes, gameRes) {
  checkArgs('getGamePos', arguments, ['point', 'point']);
  const wrongArg = a => a < 0;
  if ([appRes.x, appRes.y, gameRes.x, gameRes.y].find(wrongArg) ||
      appRes.x < gameRes.x || appRes.y < gameRes.y) {
    return null;
  }
  return new Phaser.Point(
    Math.floor((appRes.x - gameRes.x) / 2),
    Math.floor((appRes.y - gameRes.y) / 2),
  );
}
