import R from 'ramda';
import Phaser from 'phaser';
import displayManager from './display-manager';

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
}

function onResize() {

}

function render(g) {
  g.debug.inputInfo(100, 100);
}

function onDown(g, e) {
  // console.warn(e.keyCode);
  switch (e.keyCode) {
  case 70: // f
    displayManager.goFullScreen(g);
    break;
  }
}
