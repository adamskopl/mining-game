let game = null;

export default {
  init(g) {
    game = g;
  },
  goFullScreen(game) {
    if (game.scale.isFullScreen) {
      game.scale.stopFullScreen();
    } else {
      game.scale.startFullScreen(false);
    }
  },
  getSize() {
    return [game.width, game.height];
  },
};
