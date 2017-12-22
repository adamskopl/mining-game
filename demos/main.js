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

const OBJECTS_SIZE = 22;

function create() {
  game.input.keyboard.addCallbacks(null, onDown);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#124184';

  groupAll = game.add.group();
  groupFields = game.add.group(groupAll);
  groupPlayers = game.add.group(groupAll);
  groupBlockers = game.add.group(groupAll);

  const startingPos = new Phaser.Point(100, 200);
  player = groupPlayers.create(startingPos.x, startingPos.y - OBJECTS_SIZE, 'orbRed');

  const exclude = [3];
  for (let i = 0; i < 10; i += 1) {
    if (!exclude.includes(i)) {
      groupFields.create(startingPos.x + (i * OBJECTS_SIZE), startingPos.y, 'orbBlue');
    }
  }
  // extra fields
  groupFields.create(startingPos.x + (2 * OBJECTS_SIZE), startingPos.y - OBJECTS_SIZE, 'orbBlue');

  game.physics.arcade.enable(groupFields.children);
  game.physics.arcade.enable(groupPlayers.children);
  groupFields.children.forEach((o) => {
    o.body.allowGravity = false;
    o.body.immovable = true;
  });

  game.physics.arcade.gravity.y = 200;
}

function addBlocker(object, dir) {
  groupBlockers.create(object.x - dir.x * OBJECTS_SIZE, object.y, 'orbGreen');
}

function update() {
  game.physics.arcade.collide(groupFields, groupPlayers);

  if (player.moving) {
    if (Math.abs(player.x - player.startX) >= OBJECTS_SIZE) {
      console.warn('MOVED');
      player.moving = false;
      player.body.velocity.x = 0;
      console.warn(player.x);
    }
  }
}

function render() {
  groupFields.children.forEach(f => game.debug.body(f));
  groupPlayers.children.forEach(f => game.debug.body(f));
}

function onKeyDirection(dir) {
  checkArgs('onKeyDirection', arguments, ['point']);
  const vec = new Phaser.Point(dir.x, dir.y).multiply(OBJECTS_SIZE, OBJECTS_SIZE);

  player.moving = true;
  player.startX = player.x;
  player.body.velocity.x = dir.x * 50;
  // addTween(game, player, vec, 300);
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
