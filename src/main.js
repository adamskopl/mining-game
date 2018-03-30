import R from 'ramda';
import displayManager from './display-manager';
import bitmapsManager from './bitmaps-manager/bitmaps-manager';
import levelManager from './level-manager/level-manager';
import gameplay, { DIRECTION, DIRECTIONS } from './gameplay/gameplay';

let inputPolygons = null;
const game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'gameArea', {
  preload,
  create,
  resize: onResize,
  render,
});

function preload() {
}

function create(g) {
  g.input.keyboard.addCallbacks(this, R.partial(onDown, [game]));

  // g.input.onDown.add(onMouseDown, this);

  g.stage.backgroundColor = '#555555';
  g.scale.pageAlignHorizontally = true;
  g.scale.pageAlignVertically = true;
  g.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  g.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

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

  // TODO: implement swipe.
  const p = [
    new Phaser.Point(0, 0), // 0
    new Phaser.Point(w, 0), // 1
    new Phaser.Point(w, h), // 2
    new Phaser.Point(0, h), // 3
    new Phaser.Point(w/2, h/2), // 4
  ];
  inputPolygons = [
    new Phaser.Polygon(p[4], p[0], p[1], p[4]),
    new Phaser.Polygon(p[4], p[1], p[2], p[4]),
    new Phaser.Polygon(p[4], p[2], p[3], p[4]),
    new Phaser.Polygon(p[4], p[3], p[0], p[4]),
  ];
}

function render(g) {
  gameplay.update();
  g.debug.inputInfo(100, 100);
}

function onMouseDown(pointer) {
  const getFloor = (pntr, prop) => Math.floor(pntr.positionDown[prop]);
  const findFun = p => p.contains(getFloor(pointer, 'x'), getFloor(pointer, 'y'));
  const polyIndex = inputPolygons.findIndex(findFun);
  gameplay.onKeyDirection(DIRECTIONS[polyIndex]);
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
