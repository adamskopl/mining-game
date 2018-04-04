import draw from 'src/utils-draw';
import { checkArgs } from 'src/utils';
import * as updateUtils from './object-update';
import * as utils from './utils';

const Phaser = window.Phaser;
const Pnt = Phaser.Point;
const Rec = Phaser.Rectangle;
const Line = Phaser.Line;

function $move(dir) {
  checkArgs('$move', arguments, ['point']);
  if (!this.$isTweenRunning()) {
    this.vecMoveN = dir;
  }
}

// prefixing '$' to not to overwrite Sprite's function
const extraFuns = {
  $init() {
    this.$zeroTweenObj();
    this.rec = new Rec(this.x, this.y, this.width, this.height);
    this.gravity = false;
  },
  $enableGravity() {
    this.gravity = true;
  },
  $gravityEnabled() {
    return this.gravity;
  },
  $alignTo(dst, vec, offsetX = 0, offsetY = 0) {
    checkArgs('$alignTo', arguments, ['sprite', 'point', 'number', 'number']);
    const pos = utils.getAlignedPos(this, dst, vec, offsetX, offsetY);
    this.$setPos(pos);
  },
  // all position changes have to be done with $setPos, as it updates the
  // rectangle
  $setPos(pos) {
    checkArgs('$setPos', arguments, ['point']);
    [this.x, this.y] = [pos.x, pos.y];
    this.rec.setTo(this.x, this.y, this.width, this.height);
  },
  $setTweenObj(tweenObj) {
    checkArgs('$setTweenObj', arguments, ['object']);
    this.tweenObj = tweenObj;
  },
  $move,
  $zeroTweenObj() {
    if (this.tweenObj && this.tweenObj.tween) {
      this.tweenObj.tween.stop();
    }
    this.$setTweenObj({
      posTweened: null,
      tween: null,
      vecTweenN: null,
    });
  },
  $isTweenRunning() {
    return this.tweenObj.tween && this.tweenObj.tween.isRunning;
  },
  $update(objects) {
    if (this.$gravityEnabled()) {
      updateUtils.update(this, objects);
    }
  },
};

Phaser.Sprite.prototype = Object.assign(Phaser.Sprite.prototype, extraFuns);

export default function createGameObject(x, y, name, group) {
  checkArgs('createGameObject', arguments, ['number', 'number', 'string', 'object']);
  const sprite = group.create(x, y, name);
  sprite.$init();

  return sprite;
}
