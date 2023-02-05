import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { DISCOGS_BASE_URL, MAX_LOGIN_ATTEMPTS } from '../../../constants';
import { OauthIdentity, User } from '../../../domain';
import * as api from '../../api';

import { AsyncData } from '@swan-io/boxed';
import { getText } from '../../texts';
import * as userTokenService from '../../userToken.service';
import { empty } from '../../utils/json.utils';
import { actions as appActions } from '../app';
import * as appSaga from '../app/app.saga';
import { asyncError, asyncOk } from '../domain';
import { UserActions, UserActionTypes, UserResourceField } from './';
import { fromUser } from './selectors';
import { USER_ERROR } from './types';
import * as actions from './user.actions';

export const unauthorizedUser = asyncError({
  error: USER_ERROR.NOT_AUTHENTICATED,
  message: getText('log.inn.error'),
  isError: true,
});

export function* getUser(_: any, count = 0): any {
  try {
    yield put(actions.getUser(AsyncData.Loading()));
    const storedToken: string = yield call(userTokenService.get);
    if (!Boolean(storedToken) || empty(storedToken)) throw new Error(USER_ERROR.MISSING_TOKEN);
    const identity: OauthIdentity = yield call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`);
    if (identity) {
      const user: User = yield call(api.fetch, identity.resource_url);
      yield put(actions.getUser(asyncOk(user)));
      return true;
    } else {
      if (count < MAX_LOGIN_ATTEMPTS) {
        yield getUser(_, count + 1);
      } else throw new Error(USER_ERROR.NOT_AUTHENTICATED);
    }
  } catch (error) {
    console.warn('caught authentication error', error);
    yield put(appActions.error(USER_ERROR.NOT_AUTHENTICATED));
    if (count < MAX_LOGIN_ATTEMPTS) {
      yield getUser(_, count + 1);
    } else {
      yield put(actions.getUser(AsyncData.NotAsked()));
      if ((error as any).message !== USER_ERROR.MISSING_TOKEN) {
        yield appSaga.warn(getText('log.inn.error'));
      }
    }
  }
}

export function* setUserToken({ userToken }: UserActionTypes) {
  if (userToken) {
    yield call(userTokenService.set, userToken!);
    yield call(getUser, 0);
  } else {
    yield call(userTokenService.remove);
    yield put(actions.getUser(AsyncData.NotAsked()));
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
      yield call(getUser, undefined, 0);
    }
  } catch (error) {
    yield put(appActions.warn({ error: (error as Error).message }));
  }
  return result as T;
}

function* UserSaga() {
  try {
    yield all([
      takeLatest(UserActions.logOut, setUserToken),
      takeLatest(UserActions.setUserToken, setUserToken),
      takeLatest(UserActions.setUserTokenSuccess, getUser),
    ]);
  } catch (e) {
    console.error(e);
  }
  yield call(getUser, undefined);
}

export default UserSaga;
