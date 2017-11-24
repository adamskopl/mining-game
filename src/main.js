import R from 'ramda';
import Phaser from 'phaser';
import displayManager from './display-manager';
import bitmapsManager from './bitmaps-manager/bitmaps-manager';
import levelManager from './level-manager/level-manager';
import gameplayManager from './gameplayManager/gameplay-manager.js';

const game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'gameArea', {
  preload: preload,
  create: create,
  resize: onResize,
  render: render
});

function preload() {
}

function create(g) {
  g.input.keyboard.addCallbacks(this, R.partial(onDown, [game]));

  g.stage.backgroundColor = '#555555';
  g.scale.pageAlignHorizontally = true;
  g.scale.pageAlignVertically = true;
  g.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  displayManager.init(g);
  bitmapsManager.init(g);
  levelManager.init(g, displayManager.getSize());
  gameplayManager.init(g);

  levelManager.signalGroupReloaded.add(gameplayManager.onMainGroupReloaded, gameplayManager);
}

function onResize(w, h) {
  const size = [w, h];
  levelManager.onResize(size);
  bitmapsManager.onFieldResize(levelManager.getFieldSize());
}

function render(g) {
  g.debug.inputInfo(100, 100);
}

function onDown(g, e) {
  switch (e.keyCode) { // w 87, a 65, s 83, d 68
    case 65: // a
      break;
    case 68: // d
      break;
    case 70: // f
      displayManager.goFullScreen(g);
      break;
    case 83:
      break;
    case 87: // w
      break;
    default:
      break;
  }
}
