import R from 'ramda';
import { OBJECT_TYPE } from '../consts';

// temporary sort solution: in the end Tiled will be used
const oKeys = Object.keys(OBJECT_TYPE).sort();

const fields = [
  [[2  ], [   ], [2  ], [2  ], [2  ], [   ], [2  ]],
  [[2  ], [2  ], [   ], [2  ], [   ], [2  ], [2  ]],
  [[2  ], [2  ], [2  ], [3  ], [2  ], [2  ], [2  ]],
  [[2  ], [2  ], [   ], [2  ], [   ], [2  ], [2  ]],
  [[2  ], [2  ], [2  ], [   ], [2  ], [2  ], [2  ]],
  [[2  ], [2  ], [3  ], [   ], [2  ], [2  ], [2  ]],
  [[2  ], [2  ], [2  ], [1  ], [2  ], [1  ], [2  ]],
  [[2  ], [2  ], [2  ], [2  ], [2  ], [2  ], [2  ]],
  [[2  ], [1  ], [   ], [   ], [   ], [2  ], [2  ]],
  [[2  ], [2  ], [2  ], [2  ], [2  ], [2  ], [2  ]],
  [[2  ], [2  ], [2  ], [2  ], [2  ], [2  ], [2  ]],
].map(row => row.map(field => field.map(object => oKeys[object])));

function callFieldCb(cb, x, y) {
  const field = fields[y][x];
  if (field.length === 0) {
    cb(null, [x, y]);
  }
  field.forEach((objectType) => {
    cb(objectType, [x, y]);
  });
}

export default {
  forEach(cb) {
    const ranges = [R.range(0, fields[0].length), R.range(0, fields.length)];
    ranges[0].forEach((x) => {
      ranges[1].forEach((y) => {
        callFieldCb(cb, x, y);
      });
    });
  },
  getDim() {
    return [fields[0].length, fields.length];
  },
};
