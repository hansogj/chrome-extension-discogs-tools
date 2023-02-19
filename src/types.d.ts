declare module '*.png';
declare module '*.svg';
declare type Fn<H, T> = (..._: H) => T;
type Optional<T> = T | undefined;

declare type Modify<T, R> = Omit<T, keyof R> & R;

interface Hash<T> {
  [key: string]: T;
}

declare type TypedRecord<K, T> = {
  [P in keyof K]: T;
};

declare type SearchParams = Record<string, string | number>;
declare type PayLoad = { payLoad?: Record<string, any> };
declare type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;
declare type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};
