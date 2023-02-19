type ReduxAction = import('redux').Action;

export interface Action<T> extends ReduxAction {
  type: T;
}

export type ActionDataTypes<T, P> = Action<T> & Partial<P>;
