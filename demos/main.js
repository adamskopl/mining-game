import R from 'ramda';
import { checkArgs } from './utils';
import { findNeighbour, filterCoordDiff, findEdgeField } from './fieldsMethods';

const game = new Phaser.Game(400, 400, Phaser.CANVAS, 'phaser-example', {
  preload,
  create,
  update,
  render,
});

function preload() {
  game.load.spritesheet('orbBlue', 'assets/orb-blue.png', 22, 22);
  game.load.spritesheet('orbRed', 'assets/orb-red.png', 22, 22);
  game.load.spritesheet('orbGreen', 'assets/orb-green.png', 22, 22);
}

let player;
let groupFields;
let groupPlayers;
let groupAll;
let groupBlockers;

let tween = null;
let tweenTest = false;

const OBJECTS_SIZE = 22;

const Pnt = Phaser.Point;

function addBlocker(pos, group) {
  group.removeAll();
  const b = group.create(pos.x, pos.y, 'orbGreen');
  b.alpha = 0.1;
  game.physics.arcade.enable(b);
  b.body.immovable = true;
}

function create() {
  game.input.keyboard.addCallbacks(null, onDown);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#124184';

  groupAll = game.add.group();
  groupFields = game.add.group(groupAll);
  groupPlayers = game.add.group(groupAll);
  groupBlockers = game.add.group(groupAll);

  const startingPos = new Pnt(120, 100);
  player = groupPlayers.create(startingPos.y, startingPos.x, 'orbRed');

  const fieldsMargin = -5;

  function addFieldsRow(fieldsNumber, shiftY, excludeArr = []) {
    for (let i = 0; i < fieldsNumber; i += 1) {
      if (!excludeArr.includes(i)) {
        const posX = startingPos.x + (i * OBJECTS_SIZE) + fieldsMargin * OBJECTS_SIZE;
          groupFields.create(startingPos.y + (OBJECTS_SIZE * (shiftY + 1)), posX, 'orbBlue');
      }
    }
  }

  addFieldsRow(10, 0, [1, 3, 8]);
  addFieldsRow(10, 2, [1]);
  addFieldsRow(10, 4, [7]);

  game.physics.arcade.enable(groupFields.children);
  game.physics.arcade.enable(groupPlayers.children);
  game.physics.arcade.enable(groupBlockers.children);
  groupFields.children.forEach((f) => { f.body.immovable = true; });
  groupBlockers.children.forEach((f) => { f.body.immovable = true; });

  player.body.gravity.x = 800;
  // player.body.bounce.y = 0.5;

  const f = findEdgeField(player, new Pnt(-1, 0), groupFields);
  if (f) {
    // f.alpha = 0.3;
  }
}

/**
 * Move o1 outside the o2
 */
function moveObjOutside(oMoving, moveVec, oColliding) {
  const posColliding = new Pnt(oColliding.x, oColliding.y);
  const vecAlign = new Pnt(oMoving.width, oMoving.height);
  vecAlign.multiply(moveVec.x, moveVec.y);

  if (vecAlign.x !== 0) {
    oMoving.x = oColliding.x - vecAlign.x;
  }
  if (vecAlign.y !== 0) {
    oMoving.y = oColliding.y - vecAlign.y;
  }
}

let collision = false;

function collCallback(obj1, obj2) {
  collision = true;
}

function collCallbackBlock(obj1, obj2) {}

function update() {
  if (!collision) {
    // player.body.velocity.x = 0;
  }
  collision = false;
  game.physics.arcade.collide(groupFields, groupPlayers, collCallback);
  game.physics.arcade.collide(groupBlockers, groupPlayers, collCallbackBlock);
}

function render() {
  groupFields.children.forEach(f => game.debug.body(f));
  groupPlayers.children.forEach(f => game.debug.body(f));
  // groupBlockers.children.forEach(f => game.debug.body(f));
}

function onKeyDirection(dir) {
  checkArgs('onKeyDirection', arguments, ['point']);
  const speed = 200;
  [player.body.velocity.x, player.body.velocity.y] = [dir.x * speed, dir.y * speed];
  const e = findEdgeField(player, dir, groupFields);

  if (e) {
    const posX = e.x + (2 * e.width * dir.x);
    addBlocker(new Pnt(posX, e.y - e.width), groupBlockers);
  } else {
    console.warn('NO EDGE FOUND');
  }
}

function onKeyDirection2(dir) {
  checkArgs('onKeyDirection', arguments, ['point']);
}

function onDown(e) {
  switch (e.keyCode) {
    case 38: // up
    case 87: // w
      onKeyDirection(new Pnt(0, -1));
      break;
    case 39: // right
    case 68: // d
      onKeyDirection(new Pnt(1, 0));
      break;
    case 40: // down
    case 83: // s
      onKeyDirection(new Pnt(0, 1));
      break;
    case 37: // left
    case 65: // a
      onKeyDirection(new Pnt(-1, 0));
      break;
    case 70: // f
      break;
    default:
  }
}
