import { checkArgs } from 'src/utils';
import * as updateUtils from './object-update';
import * as utils from './utils';

function $move(dir) {
  checkArgs('$move', arguments, ['point']);
  if (!this.$isTweenRunning()) {
    this.vecMoveN = dir;
  }
}

// prefixing '$' to not to overwrite Sprite's function
const extraFuns = {
  /**
   * @param {GameObjectType} type
   */
  $init(type) {
    this.$type = type;
    this.$zeroTweenObj();
    this.$rec = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
    this.$gravity = false;
  },
  $enableGravity() {
    this.$gravity = true;
  },
  $gravityEnabled() {
    return this.$gravity;
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
    this.$rec.setTo(this.x, this.y, this.width, this.height);
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

/**
 * @param {GameObjectType} type
 * @param {Phaser.Point} pos
 * @param {Phaser.Group} group
 * @param {Phaser.BitmapData} bitmap
 */
export default function createGameObject(type, pos, group, bitmapData) {
  checkArgs('createGameObject', arguments, [
    'string', 'point', 'group', 'object',
  ]);
  const sprite = group.create(pos.x, pos.y, bitmapData);
  sprite.$init(type);

  return sprite;
}
