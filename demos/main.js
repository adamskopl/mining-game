import R from 'ramda';
import { checkArgs } from './utils';
import { findNeighbour, filterCoordDiff, findEdgeField } from './fields-utils';

const Pnt = Phaser.Point;

const game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', {
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

const GRAVITY_VALUE = 800;
const GRAVITY = {
  set(x, y) {
    this.x = x;
    this.y = y;
    this.p = new Pnt(x, y);
    this.neg = Pnt.negative(this.p);
    this.norm = Pnt.normalize(this.p);
    this.normNeg = Pnt.negative(this.norm);
    game.physics.arcade.gravity.copyFrom(this.p);
  },
};


function addBlocker(pos, group) {
  group.removeAll();
  const b = group.create(pos.x, pos.y, 'orbGreen');
  b.alpha = 0.1;
  game.physics.arcade.enable(b);
  b.body.immovable = true;
  b.body.allowGravity = false;
}

function create() {
  game.input.keyboard.addCallbacks(null, onDown);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  GRAVITY.set(0, -GRAVITY_VALUE);

  game.stage.backgroundColor = '#124184';

  groupAll = game.add.group();
  groupFields = game.add.group(groupAll);
  groupPlayers = game.add.group(groupAll);
  groupBlockers = game.add.group(groupAll);

  const startingPos = new Pnt(120, 200);

  player = groupPlayers.create(
    startingPos.x + (GRAVITY.x < 0 ? OBJECTS_SIZE * 8 : 0),
    startingPos.y + (GRAVITY.y < 0 ? OBJECTS_SIZE * 8 : 0),
    'orbRed');
  player.player = true;

  function addFieldsRowHorizontal(fieldsNumber, shiftY, fieldsMargin, excludeArr = []) {
    for (let i = 0; i < fieldsNumber; i += 1) {
      if (!excludeArr.includes(i)) {
        const posX = startingPos.x + (i * OBJECTS_SIZE) + (fieldsMargin * OBJECTS_SIZE);
        groupFields.create(posX, startingPos.y + (OBJECTS_SIZE * (shiftY + 1)), 'orbBlue');
      }
    }
  }

  function addFieldsRowVertical(fieldsNumber, shiftX, fieldsMargin, excludeArr = []) {
    for (let i = 0; i < fieldsNumber; i += 1) {
      if (!excludeArr.includes(i)) {
        const posX = startingPos.x + (OBJECTS_SIZE * (shiftX + 1));
        const posY = startingPos.y + (i * OBJECTS_SIZE) + (fieldsMargin * OBJECTS_SIZE);
        groupFields.create(posX, posY, 'orbBlue');
      }
    }
  }

  if (GRAVITY.y) {
    const fieldsMargin = -5;
    addFieldsRowHorizontal(10, 0, fieldsMargin, [2, 4, 8]);
    addFieldsRowHorizontal(10, 1, fieldsMargin, [2, 4, 8]);
    addFieldsRowHorizontal(10, 2, fieldsMargin, [1, 6, 7]);
    addFieldsRowHorizontal(10, 3, fieldsMargin, [1, 2, 3, 4, 5, 6]);
    addFieldsRowHorizontal(10, 4, fieldsMargin, [5, 6]);
  } else {
    const fieldsMargin = -6;
    addFieldsRowVertical(10, 0, fieldsMargin, [4]);
    addFieldsRowVertical(10, 3, fieldsMargin, [2]);
    addFieldsRowVertical(10, 5, fieldsMargin, [0, 1, 9]);
    addFieldsRowVertical(10, 7, fieldsMargin, [6]);
  }

  game.physics.arcade.enable(groupFields.children);
  game.physics.arcade.enable(groupPlayers.children);
  game.physics.arcade.enable(groupBlockers.children);

  groupFields.children.forEach((f) => { f.body.immovable = true; });
  groupBlockers.children.forEach((f) => { f.body.immovable = true; });
  groupFields.children.forEach((f) => { f.body.allowGravity = false; });
  groupBlockers.children.forEach((f) => { f.body.allowGravity = false; });


  // player.body.bounce.y = 0.2;
  // player.body.bounce.y = 0.4;
  const f = findEdgeField(player, new Pnt(0, 1), GRAVITY.p, groupFields);
  if (f) {
    // f.alpha = 0.3;
  }
}

function collCallback(obj1, obj2) {}

function collCallbackBlock(block, player) {
  console.warn(block.x, block.y);
  const propPos = GRAVITY.x === 0 ? 'x' : 'y';
  const propDim = GRAVITY.x === 0 ? 'width' : 'height';

  console.warn(propPos, propDim);

  if (block[propPos] < player[propPos]) {
    player[propPos] = block[propPos] + block[propDim];
  } else {
    player[propPos] = block[propPos] - block[propDim];
  }
}

function update() {
  game.physics.arcade.collide(groupFields, groupPlayers, collCallback);
  game.physics.arcade.collide(groupBlockers, groupPlayers, collCallbackBlock);
}

function render() {
  // groupFields.children.forEach(f => game.debug.body(f));
  // groupPlayers.children.forEach(f => game.debug.body(f));
  // groupBlockers.children.forEach(f => game.debug.body(f));
}

function onKeyDirection(dir) {
  checkArgs('onKeyDirection', arguments, ['point']);
  console.warn('onKeyDirection');

  const speed = 200;
  [player.body.velocity.x, player.body.velocity.y] = [dir.x * speed, dir.y * speed];
  const e = findEdgeField(player, dir, GRAVITY.p, groupFields);
  if (e) {
    let pos = new Pnt(e.x, e.y);
    const pDim = new Pnt(e.width, e.height);

    // TODO: OPTIMALIZATION HERE

    const transDir = Pnt.multiply(dir, pDim);
    transDir.multiply(2, 2);
    const gravDir = Pnt.multiply(GRAVITY.normNeg, pDim);
    const trans = Pnt.add(transDir, gravDir);

    pos = Pnt.add(pos, trans);

    addBlocker(pos, groupBlockers);
  } else {
    console.warn('NO EDGE FOUND');
  }
}

function onKeyDirection2(dir) {
  console.warn('onKeyDirection2');
  checkArgs('onKeyDirection', arguments, ['point']);
  GRAVITY.set(dir.x * GRAVITY_VALUE, dir.y * GRAVITY_VALUE);
  [player.body.velocity.x, player.body.velocity.y] = [0, 0];
}

function onDown(e) {;
  switch (e.keyCode) {
    case 38: // up
      onKeyDirection2(new Pnt(0, -1));
      break;
    case 87: // w
      onKeyDirection(new Pnt(0, -1));
      break;
    case 39: // right
      onKeyDirection2(new Pnt(1, 0));
      break;
    case 68: // d
      onKeyDirection(new Pnt(1, 0));
      break;
    case 40: // down
      onKeyDirection2(new Pnt(0, 1));
      break;
    case 83: // s
      onKeyDirection(new Pnt(0, 1));
      break;
    case 37: // left
      onKeyDirection2(new Pnt(-1, 0));
      break;
    case 65: // a
      onKeyDirection(new Pnt(-1, 0));
      break;
    case 70: // f
      break;
    default:
  }
}
