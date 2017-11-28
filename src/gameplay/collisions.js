import { OBJECT_TYPE } from '../consts';

const HANDLERS = [
  {
    objects: [OBJECT_TYPE.HERO, OBJECT_TYPE.FILLED],
    f(objects) {
      let [hero, filled] = objects;
      // TODO: args swap function
      if (hero.type === OBJECT_TYPE.FILLED) {
        [hero, filled] = [objects[1], objects[0]];
      }
      filled.destroy();
    },
  },
  {
    objects: [OBJECT_TYPE.HERO, OBJECT_TYPE.EMPTY],
    f(objects) {
      let [hero, empty] = objects;
      // TODO: args swap function
      if (hero.type === OBJECT_TYPE.EMPTY) {
        [hero, empty] = [objects[1], objects[0]];
      }
    },
  },
];

export function handleCollision(objects) {
  // TODO: write for ANY number of objects
  const handler = HANDLERS.find(h => h.objects.every(o => objects.map(ob => ob.type).includes(o)));
  if (handler) {
    handler.f(objects);
  }
}
