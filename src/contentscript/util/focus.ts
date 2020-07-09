import find from './find';

export default (selector: string) =>
  find(selector).forEach((query: HTMLElement) => query.focus());
