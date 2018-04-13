const TYPES = ['null', 'array', 'string', 'number', 'function', 'object'];
const PHASER_TYPES = [
  ['game', Phaser.Game],
  ['group', Phaser.Group],
  ['rectangle', Phaser.Rectangle],
  ['sprite', Phaser.Sprite],
];
const CUSTOM_TYPES = [
  ['point', function checkPoint(p) {
    return p.x !== undefined && p.y !== undefined;
  }],
];

function getPhaserClass(types, type) {
  const found = types.find(t => t[0] === type);
  return found ? found[1] : null;
}

function getCustomCheckFun(customTypes, type) {
  const found = customTypes.find(t => t[0] === type);
  return found ? found[1] : null;
}

function isTypeOf(toCheck, type, types, phaserTypes, customTypes) {
  let ret = null;
  const phaserClass = getPhaserClass(phaserTypes, type);
  const customCheckFun = getCustomCheckFun(customTypes, type);
  if (!types.includes(type) &&
    phaserClass === null &&
    customCheckFun === null
  ) {
    console.error(`${type} not in passed types`);
    return null;
  }
  if (phaserClass) {
    ret = toCheck instanceof phaserClass;
  } else if (customCheckFun) {
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

export function checkArgs(funName, argsObject, types) {
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
    !PHASER_TYPES.find(pt => pt[0] === t) &&
    !CUSTOM_TYPES.find(pt => pt[0] === t)
  ));
  if (foundBad) {
    console.error(`${funName}: wrong type in passed types: ${foundBad}`);
    return;
  }
  const wrongArg = args.find((a, index) => !isTypeOf(a, types[index],
    TYPES, PHASER_TYPES, CUSTOM_TYPES));
  if (wrongArg) {
    console.error(`${funName}: arg of the wrong type ('${wrongArg}' declared as '${types[args.indexOf(wrongArg)]}')`);
  }
}
