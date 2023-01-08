import maybe from '@hansogj/maybe';
import { AsyncData, Result } from '@swan-io/boxed';

export const getLoaded = <T>(from: AsyncData<T>) =>
  maybe(from)
    .map((it) => (it.isDone && it.isDone() && it.value ? it.get() : undefined))
    .valueOr(undefined);
export const getResult = <T>(it: Result<T, unknown>) =>
  it.isOk && it.isOk() ? it.get() : undefined;
export const getLoadedResult = <T>(from: AsyncData<Result<T, unknown>>) =>
  maybe(getLoaded(from)).map(getResult).valueOr(undefined);
export const asyncOk = <T>(val: T) => AsyncData.Done(Result.Ok(val));
export const asyncError = <T>(val: T) => AsyncData.Done(Result.Error(val));
