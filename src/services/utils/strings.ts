type Replacer = [RegExp, string];
export const trailingSlash: Replacer = [/\/+$/, ''];
export const doubleSlashes: Replacer = [/(https?:\/)\/+|\/+/g, '$1/'];
export const removeRedundantSlashes = (url: string): string =>
  url.replace(...doubleSlashes).replace(...trailingSlash);
