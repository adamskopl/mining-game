import { checkArgs } from 'src/utils';
import * as updateUtils from './update/object-update';
import * as utils from './utils';
import { moveObject } from './object-move';

export { createGameObject };

// prefixing '$' to not to overwrite Sprite's function
const extraFuns = {
  /**
   * @param {GameObjectType} type
   */
  $init(type) {
    this.$type = type;
    this.$rec = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
    this.$gravityEnabled = false;

    this.$initMov();
  },
  $enableGravity() {
    this.$gravityEnabled = true;
  },
  $isGravityEnabled() {
    return this.$gravityEnabled;
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
  /**
   * @param {Array<object>} objects
   * @param {Phaser.Point} gameSize
   * @return {Array<GameObjectEvent>} || null
   */
  $update(objects, gameSize) {
    let objectsEvents = null;
    if (this.$isGravityEnabled()) {
      objectsEvents = updateUtils.update(this, objects, gameSize);
    }
    return objectsEvents;
  },
};

Phaser.Sprite.prototype = Object.assign(Phaser.Sprite.prototype, extraFuns, moveObject);

/**
 * Game object: hero/enemy...
 * @typedef {object} GameObject
 */

/**
 * @param {GameObjectType} type
 * @param {Phaser.Point} pos
 * @param {Phaser.Group} group
 * @param {Phaser.BitmapData} bitmap
 * @return {GameObject}
 */
function createGameObject(type, pos, group, bitmapData) {
  checkArgs('createGameObject', arguments, [
    'string', 'point', 'group', 'object',
  ]);
  const sprite = group.create(pos.x, pos.y, bitmapData);
  sprite.$init(type);
  return sprite;
}
