import R from 'ramda';
import bitmapsManager from '../bitmaps-manager/bitmaps-manager';
import gameObject from '../factories/gameObject';

export default function getSprites(g, fieldSize, level) {
  const group = g.add.group();
  const ranges = [R.range(0, level[0].length), R.range(0, level.length)];
  ranges[0].forEach((x) => {
    ranges[1].forEach((y) => {
      const field = level[y][x];
      field.forEach((f) => {
        const child = group.create(fieldSize * x, fieldSize * y, bitmapsManager.getBitmap(f));
        group.replace(child, gameObject(child, { type: f }));
      });
    });
  });
  return group;
}
