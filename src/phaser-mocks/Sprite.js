Phaser.Sprite = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;

  this.top = y;
  this.right = x + w;
  this.bottom = y + h;
  this.left = x;
};
