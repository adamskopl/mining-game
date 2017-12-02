import R from 'ramda';
import Phaser from 'phaser';
import displayManager from './display-manager';
import bitmapsManager from './bitmaps-manager/bitmaps-manager';
import levelManager from './level-manager/level-manager';
import gameplay, { DIRECTION } from './gameplay/gameplay';

const game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameArea', {
  preload,
  create,
  resize: onResize,
  render,
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
  gameplay.init(g);

  [
    [levelManager.signalGroupReloaded, 'onMainGroupReloaded', [
      gameplay,
    ],
    ],
    [levelManager.signalFieldResized, 'onFieldResized', [
      bitmapsManager,
      gameplay,
    ],
    ],
  ].forEach((signalGroup) => {
    signalGroup[2].forEach((listener) => {
      signalGroup[0].add(listener[signalGroup[1]], listener);
    });
  });
}

function onResize(w, h) {
  const size = [w, h];
  levelManager.onResize(size);
}

function render(g) {
  gameplay.onTick();
  g.debug.inputInfo(100, 100);
}

function onDown(g, e) {
  switch (e.keyCode) {
    case 38: // up
    case 87: // w
      gameplay.onKeyDirection(DIRECTION.UP);
      break;
    case 39: // right
    case 68: // d
      gameplay.onKeyDirection(DIRECTION.RIGHT);
      break;
    case 40: // down
    case 83: // s
      gameplay.onKeyDirection(DIRECTION.DOWN);
      break;
    case 37: // left
    case 65: // a
      gameplay.onKeyDirection(DIRECTION.LEFT);
      break;
    case 70: // f
      displayManager.goFullScreen(g);
      break;
    default:
  }
}
