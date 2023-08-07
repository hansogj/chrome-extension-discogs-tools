import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { DISCOGS_BASE_URL } from '../../../constants';
import { OauthIdentity, User } from '../../../domain';
import * as api from '../../api';

import { AsyncData } from '@swan-io/boxed';
import { getText } from '../../texts';
import * as userTokenService from '../../userToken.service';
import { empty } from '../../utils/json.utils';
import { actions as appActions } from '../app';
import * as appSaga from '../app/app.saga';
import { asyncError, asyncOk } from '../domain';
import { UserActionTypes, UserActions, UserResourceField } from './';
import { fromUser } from './selectors';
import { USER_ERROR } from './types';
import * as actions from './user.actions';

export const unauthorizedUser = asyncError({
  error: USER_ERROR.NOT_AUTHENTICATED,
  message: getText('log.inn.error'),
  isError: true,
});

export function* getUser(): any {
  yield put(actions.getUser({ user: AsyncData.Loading() }));
  try {
    const storedToken: string = yield call(userTokenService.get);

    if (!Boolean(storedToken) || empty(storedToken)) {
      yield put(actions.getUser({ user: AsyncData.NotAsked() }));
      return false;
    } else {
      const identity: OauthIdentity = yield call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`);

      if (identity) {
        const user: User = yield call(api.fetch, identity.resource_url);
        yield put(actions.getUser({ user: asyncOk(user) }));
        return true;
      } else {
        throw new Error(USER_ERROR.NOT_AUTHENTICATED);
      }
    }
  } catch (error) {
    yield put(actions.getUser({ user: AsyncData.NotAsked() }));
    yield appSaga.warn(getText('log.inn.error'));
  }
}

export function* setUserToken({ userToken }: UserActionTypes) {
  if (userToken) {
    yield call(userTokenService.set, userToken!);
    yield call(getUser);
  } else {
    yield call(userTokenService.remove);
    yield put(actions.getUser({ user: AsyncData.NotAsked() }));
  }
}

export function* fetchUserResource<T>(field: UserResourceField, body?: SearchParams) {
  let result: T = undefined as unknown as T;
  try {
    const resource: string = yield select(fromUser(field as unknown as keyof User));
    if (resource) {
      result = yield call(api.fetch as any, resource, body);
      if (!result) {
        throw new Error('Failing when reach for api');
      }
    } else {
      yield call(getUser);
    }
  } catch (error) {
    yield put(appActions.warn({ error: (error as Error).message }));
  }
  return result as T;
}

function* UserSaga() {
  try {
    yield all([
      takeLatest(UserActions.USER_LOG_OUT, setUserToken),
      takeLatest(UserActions.SET_USER_TOKEN, setUserToken),
      takeLatest(UserActions.SET_USER_TOKEN_SUCCESS, getUser),
    ]);
  } catch (e) {
    console.error(e);
  }
  yield call(getUser);
}

export default UserSaga;
