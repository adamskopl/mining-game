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

export { checkArgs, debugError };

function debugError(e) {
  console.error(e);
  debugger;
}

function getCustomCheckFun(customTypes, type) {
  const found = customTypes.find(t => t[0] === type);
  return found ? found[1] : null;
}

function isTypeOf(toCheck, type, types, customTypes) {
  let ret = null;
  const customCheckFun = getCustomCheckFun(customTypes, type);
  if (!types.includes(type) &&
    customCheckFun === null
  ) {
    debugError(`${type} not in passed types`);
    return null;
  }
  if (toCheck === null) {
    // assumption: passing null is intentional as an alternative to the declared
    // value
    ret = true;
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

function checkArgs(funName, argsObject, types) {
  // TODO: release? TURN OFF (so the chekArgs is not invoked so frequently!)
  const args = Array.prototype.slice.call(argsObject, 0);
  if (typeof funName !== 'string' || !Array.isArray(args) || !Array.isArray(types)) {
    debugError(`${funName}: wrong argument`);
    return;
  }
  if (args.length !== types.length) {
    debugError(`${funName}: args and types arrays have different lengths`);
    return;
  }
  const foundBad = types.find(t => (!TYPES.includes(t) &&
    !CUSTOM_TYPES.find(ct => ct[0] === t)
  ));
  if (foundBad) {
    debugError(`${funName}: wrong type in passed types: ${foundBad}`);
    return;
  }
  const wrongArgIndex = args.findIndex((a, index) => {
    const res = isTypeOf(a, types[index], TYPES, CUSTOM_TYPES);
    return !res;
  });
  if (wrongArgIndex !== -1) {
    debugError(`${funName}: arg of the wrong type ('${args[wrongArgIndex]}' declared as '${types[wrongArgIndex]}')`);
  }
}
