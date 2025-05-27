export function someHandler(arr, target) {
  return arr?.some(({ id }) => id === target);
}
