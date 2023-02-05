import { all, fork } from 'redux-saga/effects';
import DiscogsSaga from './discogs/discogs.saga';
import AppSaga from './app/app.saga';
import WantListSaga from './wantlist/wantlist.saga';
import FoldersSaga from './folders/folders.saga';
import UserSaga from './user/user.saga';

export default function* rootSaga() {
  try {
    yield all([
      fork(DiscogsSaga),
      fork(AppSaga),
      fork(WantListSaga),
      fork(FoldersSaga),
      fork(UserSaga),
    ]);
  } catch (error) {
    debugger;
  }
}
