const TYPES = ['null', 'array', 'point', 'string', 'number', 'function', 'object'];

/**
 * @param [String] toCheck
 * @param [Array] args
 * @param [Array] types
 */
function isTypeOf(toCheck, type, types) {
  let ret = null;
  if (!types.includes(type)) {
    console.error(`${type} not in passed types`);
    return null;
  }
  switch (type) {
    case 'null':
      ret = toCheck === null;
      break;
    case 'array':
      ret = Array.isArray(toCheck);
      break;
    case 'point':
      ret = toCheck instanceof Phaser.Point;
      break;
    default:
      ret = typeof toCheck === type;
  }
  return ret;
}

export function checkArgs(funName, argsObject, types) {
  const args = Array.prototype.slice.call(argsObject, 0);
  if (typeof funName !== 'string' || !Array.isArray(args) || !Array.isArray(types)) {
    console.error(`${funName}: wrong argument`);
    return;
  }
  if (args.length !== types.length) {
    console.error(`${funName}: args and types arrays have different lengths`);
    return;
  }
  const foundBad = types.find(t => !TYPES.includes(t));
  if (foundBad) {
    console.error(`${funName}: wrong type in passed types: ${foundBad}`);
    return;
  }
  const wrongArg = args.find((a, index) => !isTypeOf(a, types[index], TYPES));
  if (wrongArg) {
    console.error(`${funName}: arg of the wrong type ('${wrongArg}' declared as '${types[args.indexOf(wrongArg)]}')`);
  }
}
