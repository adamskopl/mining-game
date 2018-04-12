import R from 'ramda';
import { OBJECT_TYPE } from '../consts';

// temporary sort solution: in the end Tiled will be used
const Phaser = window.Phaser;
const oKeys = Object.keys(OBJECT_TYPE).sort();

const fields = [
  [[   ], [   ], [3  ], [1  ], [   ]],
  [[2  ], [2  ], [2  ], [2  ], [2  ]],
  [[   ], [   ], [3  ], [1  ], [   ]],
  [[2  ], [2  ], [2  ], [2  ], [2  ]],
  [[   ], [   ], [3  ], [   ], [1  ]],
  [[2  ], [2  ], [2  ], [2  ], [2  ]],
].map(row => row.map(field => field.map(object => oKeys[object])));

function callFieldCb(cb, x, y) {
  const field = fields[y][x];
  if (field.length === 0) {
    cb(null, new Phaser.Point(x, y));
  }
  field.forEach((objectType) => {
    cb(objectType, new Phaser.Point(x, y));
  });
}

export default {
  /**
   * @param {function} cb to be called with ({OBJECT_TYPE}, {Phaser.Point}) for
   * every field
   */
  forEach(cb) {
    const ranges = [R.range(0, fields[0].length), R.range(0, fields.length)];
    ranges[0].forEach((x) => {
      ranges[1].forEach((y) => {
        callFieldCb(cb, x, y);
      });
    });
  },
  /**
   * @return {Phaser.Point} fields number
   */
  getDim() {
    return new Phaser.Point(fields[0].length, fields.length);
  },
};
