/* eslint-disable @typescript-eslint/no-namespace */
import { AsyncData, Result as BoxedResult } from '@swan-io/boxed';
import { User as UserDTO } from '../../../domain';
import { Notification } from '../app/types';

export type AsyncError = Notification;
export declare namespace Result {
  type User = BoxedResult<UserDTO, Notification>;

  type Type<T> = BoxedResult<T, Notification>;
}

export declare namespace Async {
  type User = AsyncData<Result.User>;

  type Type<T> = AsyncData<Result.Type<T>>;
}
