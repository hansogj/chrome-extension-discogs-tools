declare module '*.png';
declare module '*.svg';
declare type Fn<H, T> = (..._: H) => T;
type Optional<T> = T | undefined;

declare type Modify<T, R> = Omit<T, keyof R> & R;

interface Hash<T> {
  [key: string]: T;
}

type TypedRecord<K, T> = {
  [P in keyof K]: T;
};

type SearchParams = Record<string, string | number>;
type PayLoad = { payLoad?: Record<string, any> };
type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;
