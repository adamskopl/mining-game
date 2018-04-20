const TYPES = ['null', 'array', 'string', 'number', 'function', 'object'];
const CUSTOM_TYPES = [
  ['group', function checkRect(g) {
    return g.type === Phaser.GROUP;
  }],
  ['point', function checkPoint(p) {
    return p.type === Phaser.POINT;
  }],
  ['rectangle', function checkRect(r) {
    return r.type === Phaser.RECTANGLE;
  }],
  ['sprite', function checkRect(s) {
    return s.type === Phaser.SPRITE;
  }],
];

function getCustomCheckFun(customTypes, type) {
  const found = customTypes.find(t => t[0] === type);
  return found ? found[1] : null;
}

function isTypeOf(toCheck, type, types, customTypes, test) {
  let ret = null;
  const customCheckFun = getCustomCheckFun(customTypes, type);
  if (!types.includes(type) &&
    customCheckFun === null
  ) {
    console.error(`${type} not in passed types`);
    return null;
  }
  if (customCheckFun) {
    ret = customCheckFun(toCheck);
  } else {
    switch (type) {
      case 'null':
        ret = toCheck === null;
        break;
      case 'array':
        ret = Array.isArray(toCheck);
        break;
      default:
        ret = typeof toCheck === type;
    }
  }
  return ret;
}

export function checkArgs(funName, argsObject, types, test) {
  // TODO: release? TURN OFF (so the chekArgs is not invoked so frequently!)
  const args = Array.prototype.slice.call(argsObject, 0);
  if (typeof funName !== 'string' || !Array.isArray(args) || !Array.isArray(types)) {
    console.error(`${funName}: wrong argument`);
    return;
  }
  if (args.length !== types.length) {
    console.error(`${funName}: args and types arrays have different lengths`);
    return;
  }
  const foundBad = types.find(t => (!TYPES.includes(t) &&
    !CUSTOM_TYPES.find(ct => ct[0] === t)
  ));
  if (foundBad) {
    console.error(`${funName}: wrong type in passed types: ${foundBad}`);
    return;
  }
  const wrongArg = args.find((a, index) => !isTypeOf(a, types[index],
    TYPES, CUSTOM_TYPES, test));
  if (wrongArg) {
    console.error(`${funName}: arg of the wrong type ('${wrongArg}' declared as '${types[args.indexOf(wrongArg)]}')`);
  }
}
