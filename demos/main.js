import R from 'ramda';
import { checkArgs } from './utils';

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

function create() {
  game.input.keyboard.addCallbacks(null, onDown);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#124184';

  groupAll = game.add.group();
  groupFields = game.add.group(groupAll);
  groupPlayers = game.add.group(groupAll);
  groupBlockers = game.add.group(groupAll);

  const startingPos = new Phaser.Point(100, 100);
  player = groupPlayers.create(startingPos.x, startingPos.y, 'orbRed');

  const exclude = [5];
  const fieldsNumber = 10;
  const fieldsMargin = -3;
  for (let i = 0; i < fieldsNumber; i += 1) {
    if (!exclude.includes(i)) {
      const posX = startingPos.x + (i * OBJECTS_SIZE) + fieldsMargin * OBJECTS_SIZE;
      groupFields.create(posX, startingPos.y + OBJECTS_SIZE, 'orbBlue');
    }
  }

  groupBlockers.create(startingPos.x + OBJECTS_SIZE * 3, startingPos.y, 'orbGreen');
  groupBlockers.children.forEach((s) => { s.alpha = 0.1; });

  game.physics.arcade.enable(groupFields.children);
  game.physics.arcade.enable(groupPlayers.children);
  game.physics.arcade.enable(groupBlockers.children);
  groupFields.children.forEach((f) => { f.body.immovable = true; });
  groupBlockers.children.forEach((f) => { f.body.immovable = true; });

  player.body.gravity.y = 200;
  player.body.bounce.y = 0.5;
}

/**
 * Move o1 outside the o2
 */
function moveObjOutside(oMoving, moveVec, oColliding) {
  const posColliding = new Phaser.Point(oColliding.x, oColliding.y);
  const vecAlign = new Phaser.Point(oMoving.width, oMoving.height);
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

function collCallbackBlock(obj1, obj2) {
}

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
}

function onKeyDirection2(dir) {
  checkArgs('onKeyDirection', arguments, ['point']);
}

function onDown(e) {
  switch (e.keyCode) {
    case 38: // up
    case 87: // w
      onKeyDirection(new Phaser.Point(0, -1));
      break;
    case 39: // right
    case 68: // d
      onKeyDirection(new Phaser.Point(1, 0));
      break;
    case 40: // down
    case 83: // s
      onKeyDirection(new Phaser.Point(0, 1));
      break;
    case 37: // left
    case 65: // a
      onKeyDirection(new Phaser.Point(-1, 0));
      break;
    case 70: // f
      break;
    default:
  }
}

function addTween(game, obj, vec, moveDur) {
  checkArgs('addTween', arguments, ['object', 'object', 'point', 'number']);
  return game.add.tween(obj).to({ x: obj.x + vec.x, y: obj.y + vec.y },
    moveDur,
    Phaser.Easing.Bounce.Linear,
    true,
  );
}
