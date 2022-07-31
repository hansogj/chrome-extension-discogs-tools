export const equals = (a: Object, b: Object) =>
  JSON.stringify(a, null, 0) === JSON.stringify(b, null, 0);
export const empty = (obj: Object) => equals(obj, {});
