export default function copyArray(a) {
  const newArray = a.slice(0);
  for (let i = newArray.length; i > 0; i--) {
    if (newArray[i] instanceof Array) {
      newArray[i] = copyArray(newArray[i]);
    }
  }
  return newArray;
}
