export const find = (
  selector: string,
  root: Document | Element = window.document
) => Array.from(root.querySelectorAll(selector));

export default find;
