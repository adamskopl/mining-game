import { OBJECT_TYPE } from '../consts';

// temporary sort solution: in the end Tiled will be used
const oKeys = Object.keys(OBJECT_TYPE).sort();

export default [
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
