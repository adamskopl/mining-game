export default {
  goFullScreen(game) {
    if (game.scale.isFullScreen) {
      game.scale.stopFullScreen();
    } else {
      game.scale.startFullScreen(false);
    }
  },
};
