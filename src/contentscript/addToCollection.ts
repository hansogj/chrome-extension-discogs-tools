import * as api from './api';
import { Release } from './model';
import getReleaseId from './util/getReleaseId';
export interface Folder {
  folder_id?: number;
  name: string;
}

function addToFolder(release_id: number, folder: Folder) {
  if (release_id !== undefined) {
    api
      .addToCollection(release_id)
      .then((release: Release) =>
        addFolderAndCondition(release_id, release, folder)
      );
  } else {
    alert(`Release_id: ${release_id}`);
  }
}

const log = (e) => (console.log(e), e);

const error = (e) => {
  return console.error(e), e;
};

function addFolderAndCondition(
  release_id: number,
  release: Release,
  { folder_id, name }: Folder
) {
  var coll_id = parseInt(`${release.id}`);

  Promise.all([
    setFolder(coll_id, folder_id, name),
    setMediaCondition(coll_id, release_id),
    setSleveCondition(coll_id, release_id),
  ])
    .then(log)
    .then(() => window.location.reload())
    .catch(error);
}

const setFolder = (coll_id: number, folder_id: number, val: string) =>
  api.update({
    coll_id,
    val,
    folder_id,
    notes: `setting folder ${val} (${folder_id})`,
  });

const setMediaCondition = (coll_id: number, release_id: number) =>
  api.update({
    release_id,
    coll_id,
    field_id: '1',
    folder_id: null,
    val: 'Very Good Plus (VG+)',
    notes: 'Very Good Plus (VG+)',
  });

const setSleveCondition = (coll_id: number, release_id: number) =>
  api.update({
    release_id,
    coll_id,
    field_id: '2',
    folder_id: null,
    val: 'Very Good Plus (VG+)',
    notes: 'Very Good Plus (VG+)',
  });

export const addToCollection = (folder: Folder) => {
  addToFolder(getReleaseId(), folder);
};
