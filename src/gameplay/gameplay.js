import { GAME_OBJECT_TYPE } from '../consts';
import * as objectUtils from 'src/object/utils';
import {
  GAME_OBJECT_EVENT_TYPE,
} from 'src/object/object-event';
import { getObjectsEventsForKeyDirection } from './gameplay-hero';


// TODO: move to the phaser group? e.g. group.filter(). Array methods in a
// group.
const objectsFilterTypes = (objects, types) =>
  objects.filter(c => types.includes(c.$type));
const objectsFilter = (group, test) => group.children.filter(test);

export default {
  init(g) {
    this.g = g;
    this.mainGroup = null;
    this.fieldSize = null;
    // To first cache object events and then handle them in one place.
    this.gameObjectsEventsToHandle = [];
  },
  // when the main sprites group is reloaded
  onMainGroupReloaded(mainGroup) {
    this.mainGroup = mainGroup;

    // enable gravity for some types
    objectsFilterTypes(
      this.mainGroup.children, [GAME_OBJECT_TYPE.HERO, GAME_OBJECT_TYPE.FRIEND],
    ).forEach(function (o) {
      o.$enableGravity();
    });
  },
  onKeyDirection(direction) {
    const mapHeroEvent = getObjectsEventsForKeyDirection.bind(
      null,
      objectsFilterTypes(
        this.mainGroup.children, [GAME_OBJECT_TYPE.FILLED],
      ),
      direction,
      this.mainGroup,
    );
    const gameObjectsEvents =
      objectsFilterTypes(this.mainGroup.children, [GAME_OBJECT_TYPE.HERO])
        .map(mapHeroEvent)
        .reduce((acc, val) => acc.concat(val), []);
    this.pushGameObjectsEventsToHandle(gameObjectsEvents);
  },
  onFieldResized(fieldSize) {
    this.fieldSize = fieldSize;
  },
  /**
   * @param {Array<GameObjectEvent>} objectEvent
   */
  pushGameObjectsEventsToHandle(gameObjectEvents) {
    this.gameObjectsEventsToHandle =
      this.gameObjectsEventsToHandle.concat(gameObjectEvents);
  },
  update() {
    if (!this.mainGroup) {
      return;
    }
    // 1. handle collected events
    this.gameObjectsEventsToHandle.forEach(e => e.resolve());
    this.gameObjectsEventsToHandle = [];

    // 2. update objects, handle update events
    // Array<GameObjectEvent>
    const objectsEvents = this.mainGroup.children
      .map(runObjectUpdate.bind(null, this.mainGroup.children, this.fieldSize))
      .reduce((acc, val) => acc.concat(val), [])
      .filter(x => x !== null);

    // TODO: merge objectsEventsToHandle
    objectsEvents.forEach(e => e.resolve());
  },
};

function runObjectUpdate(others, fieldSize, o) {
  return o.$update(
    others.filter(x => x !== o),
    fieldSize,
  );
}
