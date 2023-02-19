import { ActionDataTypes } from './types';

export const toAction = <T, P>(type: T, data: Partial<P> = {}): ActionDataTypes<T, P> => ({
  ...data,
  type,
});
