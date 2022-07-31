import texts from "./texts.json";
export type Texts = typeof texts;
export type Key = keyof Texts;
export const getText = (key: Key) =>
  Object.getOwnPropertyDescriptor(texts, key) ? texts[key] : "";
export const getTexts = (...keys: Array<Key>) => keys.map(getText);

export const renderText = (key: Key, props: Record<string, any> = {}) =>
  Object.entries(props).reduce(
    (res, [key, value]) => res.replace(new RegExp(`{{${key}}}`, "gi"), value),
    getText(key)
  );
