export const find = (selector: string, root: Document | Element = window && window.document) =>
  Array.from(root.querySelectorAll(selector));

export default find;
