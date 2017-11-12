import R from 'ramda';
import CONSTS from './consts';
import bitmapsManager from './bitmaps-manager';
import displayManager from './display-manager';
import { getGamePos } from './display-utils';
import { getFieldSize } from './level-utils';

let game = null;
let groupFields = null;

function getGroupFieldPos(gameSize, fieldSize) {
  return getGamePos(displayManager.getSize(), CONSTS.FIELDS.map(f => f * fieldSize));
}

function reloadSprites(fieldSize) {
  groupFields.removeAll();
  R.range(0, CONSTS.FIELDS[0]).forEach((x) => {
    R.range(0, CONSTS.FIELDS[1]).forEach((y) => {
      groupFields.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap());
    });
  });
}

export default {
  init(g) {
    game = g;
    groupFields = game.add.group();
  },

  onResize(gameSize) {
    const fieldSize = getFieldSize(gameSize, CONSTS.FIELDS);
    reloadSprites(fieldSize);
    const tmp = getGroupFieldPos(gameSize, fieldSize);
    [groupFields.x, groupFields.y] = getGroupFieldPos(gameSize, fieldSize);
  },
};
