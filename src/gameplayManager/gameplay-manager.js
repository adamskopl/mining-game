export default {
  init(g) {
    this.g = g;
    this.mainGroup = null;
  },
  // when the main sprites group is reloaded
  onMainGroupReloaded(group) {
    this.mainGroup = group;
  },
};
