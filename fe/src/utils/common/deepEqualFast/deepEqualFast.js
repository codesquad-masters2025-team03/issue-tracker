export default function deepEqualFast(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return a === b;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys?.length !== bKeys?.length) return false;

  for (let key of aKeys) {
    if (!b.hasOwnProperty(key)) return false;
    if (!deepEqualFast(a[key], b[key])) return false;
  }

  return true;
}
