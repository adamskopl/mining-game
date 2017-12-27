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

  const startingPos = new Phaser.Point(100, 200);
  player = groupPlayers.create(startingPos.x, startingPos.y, 'orbRed');

  groupFields.create(
    startingPos.x + OBJECTS_SIZE * 1.5,
    startingPos.y - OBJECTS_SIZE / 2,
    'orbBlue');
  groupFields.create(
    startingPos.x + OBJECTS_SIZE / 2,
    startingPos.y + OBJECTS_SIZE * 1.5,
    'orbBlue');

  // const exclude = [3];
  // const fieldsNumber = 1;
  // for (let i = 0; i < fieldsNumber; i += 1) {
  //   if (!exclude.includes(i)) {
  //     const posX = startingPos.x + (i * OBJECTS_SIZE);
  //     groupFields.create(posX, startingPos.y, 'orbBlue');
  //     console.warn(posX);
  //   }
  // }

  game.physics.arcade.enable(groupFields.children);
  game.physics.arcade.enable(groupPlayers.children);
}

const getRectPoints = r => [
  r.getBounds().getPoint(Phaser.TOP_LEFT),
  r.getBounds().getPoint(Phaser.TOP_RIGHT),
  r.getBounds().getPoint(Phaser.BOTTOM_RIGHT),
  r.getBounds().getPoint(Phaser.BOTTOM_LEFT),
];

/**
 * Move o1 outside the o2
 */
function moveObjOutside(oMoving, moveVec, o2) {
  const intersection = Phaser.Rectangle.intersection(
    oMoving.getBounds(),
    o2.getBounds()
  );
    console.warn(intersection);
    const returnVec = Phaser.Point.multiply(new Phaser.Point);


    // PRZESUN O NEGATYWNY WEKTOR!
}

function collCallback(obj1, obj2) {
  if (!tweenTest) {
    tweenTest = true;
    tween.stop();
    const objMoving = tween.target;
    const objColl = objMoving === obj1 ? obj2 : obj1;
    if (objMoving === objColl) {
      console.error('===');
    }
    moveObjOutside(objMoving, objMoving.moveVec, objColl);
  }
}

function update() {
  game.physics.arcade.collide(groupFields, groupPlayers, collCallback);
}

function render() {
  groupFields.children.forEach(f => game.debug.body(f));
  groupPlayers.children.forEach(f => game.debug.body(f));
}

function onKeyDirection(dir) {
  checkArgs('onKeyDirection', arguments, ['point']);
  const vec = new Phaser.Point(dir.x, dir.y).multiply(OBJECTS_SIZE, OBJECTS_SIZE);
  player.moveVec = vec;
  tween = addTween(game, player, vec, 300);
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
