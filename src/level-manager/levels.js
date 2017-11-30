import R from 'ramda';
import { OBJECT_TYPE } from '../consts';

// temporary sort solution: in the end Tiled will be used
const oKeys = Object.keys(OBJECT_TYPE).sort();

const fields = [
  [[1  ], [   ], [1  ], [1  ], [1  ], [   ], [1  ]],
  [[1  ], [1  ], [   ], [1  ], [   ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [ 2 ], [1  ], [1  ], [1  ]],
  [[1  ], [1  ], [   ], [1  ], [   ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [1  ], [1  ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [1  ], [1  ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [1  ], [1  ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [1  ], [1  ], [1  ], [1  ]],
  [[1  ], [1  ], [   ], [   ], [   ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [1  ], [1  ], [1  ], [1  ]],
  [[1  ], [1  ], [1  ], [1  ], [1  ], [1  ], [1  ]],
].map(row => row.map(field => field.map(object => oKeys[object])));

export default {
  // cb(object, [x, y])
  forEach(cb) {
    const ranges = [R.range(0, fields[0].length), R.range(0, fields.length)];
    ranges[0].forEach((x) => {
      ranges[1].forEach((y) => {
        const field = fields[y][x];
        field.forEach((objectType) => {
          cb(objectType, [x, y]);
        });
      });
    });
  },
  getDim() {
    return [fields[0].length, fields.length];
  },
};
