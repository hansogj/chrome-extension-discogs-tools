export default (selector: string, root: Document | Element = window.document) =>
  Array.from(root.querySelectorAll(selector));
