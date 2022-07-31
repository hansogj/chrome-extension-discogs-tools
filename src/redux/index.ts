/* eslint-disable no-duplicate-imports */
import { store, action } from "./store";
import type { RootState } from "./root.reducers";
import type { ActionTypes } from "./store";

export { store, action };
export * from "./types";
export type { ActionTypes, RootState };
export type Error = { message: string };
