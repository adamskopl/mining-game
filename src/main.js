import bitmapsManager from 'src/bitmaps-manager/bitmaps-manager';
import R from 'ramda';
import displayManager from './display-manager';
import levelManager from './level-manager/level-manager';
import gameplay from './gameplay/gameplay';

let inputPolygons = null;
const DIRECTION_VECS = [
  new Phaser.Point(0, -1),
  new Phaser.Point(1, 0),
  new Phaser.Point(0, 1),
  new Phaser.Point(-1, 0),
];

const game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'gameArea', {
  create,
  preload,
  render,
  resize,
  update,
});

function create(g) {
  g.input.keyboard.addCallbacks(this, R.partial(onDown, [game]));

  g.input.onDown.add(onMouseDown, this);

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
    [levelManager.signalGroupReloaded,
      'onMainGroupReloaded', [
        gameplay,
      ],
    ],
    [levelManager.signalFieldResized,
      'onFieldResized', [
        bitmapsManager,
        gameplay,
      ],
    ],
  ].forEach((signalGroup) => {
    signalGroup[2].forEach((listener) => {
      signalGroup[0].add(listener[signalGroup[1]], listener);
    });
  });
  resize(game.width, game.height);
}

function preload() {}

function render(g) {
  g.debug.inputInfo(100, 100);
}

function resize(w, h) {
  levelManager.onResize(new Phaser.Point(w, h));
  const p = [
    new Phaser.Point(0, 0), // 0
    new Phaser.Point(w, 0), // 1
    new Phaser.Point(w, h), // 2
    new Phaser.Point(0, h), // 3
    new Phaser.Point(w / 2, h / 2), // 4
  ];
  inputPolygons = [
    new Phaser.Polygon(p[4], p[0], p[1], p[4]),
    new Phaser.Polygon(p[4], p[1], p[2], p[4]),
    new Phaser.Polygon(p[4], p[2], p[3], p[4]),
    new Phaser.Polygon(p[4], p[3], p[0], p[4]),
  ];
}


function onMouseDown(pointer) {
  // TODO: implement swipe

  const getFloor = (pntr, prop) => Math.floor(pntr.positionDown[prop]);
  const findFun = p =>
    p.contains(getFloor(pointer, 'x'), getFloor(pointer, 'y'));
  const polyIndex = inputPolygons.findIndex(findFun);
  gameplay.onKeyDirection(DIRECTION_VECS[polyIndex]);
}

function update(g) {
  gameplay.update();
}

function onDown(g, e) {
  switch (e.keyCode) {
    case 38: // up
    case 87: // w
      gameplay.onKeyDirection(new Phaser.Point(0, -1));
      break;
    case 39: // right
    case 68: // d
      gameplay.onKeyDirection(new Phaser.Point(1, 0));
      break;
    case 40: // down
    case 83: // s
      gameplay.onKeyDirection(new Phaser.Point(0, 1));
      break;
    case 37: // left
    case 65: // a
      gameplay.onKeyDirection(new Phaser.Point(-1, 0));
      break;
    case 70: // f
      displayManager.goFullScreen(g);
      break;
    default:
  }
}

