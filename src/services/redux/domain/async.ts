/* eslint-disable @typescript-eslint/no-namespace */
import { AsyncData, Result as BoxedResult } from '@swan-io/boxed';
import { User as UserDTO } from '../../../domain';
import { Notification } from '../app/types';

export declare namespace Result {
  type User = BoxedResult<UserDTO, Notification>;
}

export declare namespace Async {
  type User = AsyncData<Result.User>;
}
