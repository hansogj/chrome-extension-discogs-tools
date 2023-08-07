import maybe, { Maybe } from '@hansogj/maybe';
import { AsyncData, Result } from '@swan-io/boxed';
import { Async, AsyncError, Result as AsyncResult } from './async';

export const asyncOk = <T>(val: T) => AsyncData.Done(Result.Ok(val));
export const asyncError = <T>(val: T) => AsyncData.Done(Result.Error(val));

export const asyncMaybeDone = <T>(val: Async.Type<T>): Maybe<AsyncResult.Type<T>> =>
  maybe(val as Async.Type<T>)
    .map((it) => (it.isDone && it.isDone() ? it.get() : undefined))
    .nothingUnless(Boolean) as Maybe<AsyncResult.Type<T>>;

export const asyncMaybeOk = <T>(val: Async.Type<T>): Maybe<T> =>
  asyncMaybeDone(val)
    .map((it) => (it?.isOk && it?.isOk() ? it.get() : undefined))
    .nothingUnless(Boolean) as Maybe<T>;

export const asyncMaybeError = <T>(val: Async.Type<T>): Maybe<AsyncError> =>
  asyncMaybeDone(val)
    .map((it) => (it?.isError && it?.isError() ? it.getError() : undefined))
    .nothingUnless(Boolean) as Maybe<AsyncError>;
