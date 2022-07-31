import maybe from "maybe-for-sure";
import {
  HightlightedLabels,
  MasterRelease,
  ResourceUrl,
  Version,
} from "../../../domain";
import { SelectedFields } from "../../../domain/Inventory";
import { DiscogsActions } from "../../../redux/discogs";
import { MessageActions } from "../../../services/chrome/types";
import { Cache } from "../../chrome/wantlist.service";
import messageHandler from "../message.handler";
import { getMockRelease } from "./__mock__/release.in.view";

export const fetch = async <T>(resource: ResourceUrl, body?: SearchParams) =>
  messageHandler<T>({ type: MessageActions.fetch, resource, body });

export const put = async <T>(
  resource: ResourceUrl,
  body?: SearchParams & PayLoad
) => messageHandler<T>({ type: MessageActions.put, resource, body });

export const post = async <T>(
  resource: ResourceUrl,
  body?: SearchParams & PayLoad
) => messageHandler<T>({ type: MessageActions.post, resource, body });

export const deleteResource = async <T>(resource: ResourceUrl) =>
  messageHandler<T>({ type: MessageActions.deleteResource, resource });

export const setUserToken = async (userToken: string) =>
  messageHandler({ type: MessageActions.setUserToken, body: userToken }).then(
    (e) => `${e}`
  );

export const manipulateDom = async (
  body: DiscogsActions,
  resource: ResourceUrl
) =>
  messageHandler({ type: MessageActions.DOM, body: body, resource }).catch(
    () =>
      new Error(
        "not able to do dom-manipulation in this view: " + JSON.stringify(body)
      )
  );

export const getWantList = async (userId: number) =>
  messageHandler<Cache>({ type: MessageActions.GET_WANT_LIST, userId }).then(
    (cache) => maybe(cache).valueOr({}) as Cache
  );

export const syncWantList = async (userId: number, url: string) =>
  messageHandler<Cache>({
    type: MessageActions.SYNC_WANT_LIST,
    body: url,
    userId,
  }).then((cache) => maybe(cache).valueOr({}) as Cache);

export const setSelectedFields = async (
  userId: number,
  selectedFields: SelectedFields
) =>
  messageHandler<SelectedFields>({
    type: MessageActions.SET_SELECTED_FIELDS,
    body: selectedFields as any,
    userId,
  }).then((it) => maybe(it).valueOr(selectedFields));

export const getSelectedFields = async (userId: number) =>
  messageHandler<SelectedFields>({
    type: MessageActions.GET_SELECTED_FIELDS,
    userId,
  }).then((it) => maybe(it).valueOr({}));

export const getReleasePageItem = async () =>
  messageHandler<Optional<MasterRelease>>(
    { type: MessageActions.GET_RELEASE_PAGE_ITEM_ID },
    { resource: getMockRelease() }
  );

export const reload = async () =>
  messageHandler<Optional<MasterRelease>>({
    type: MessageActions.WINDOW_RELOAD,
  });

export const getAllWantedVersionsOfItem = async (resource: string) =>
  messageHandler<Optional<MasterRelease>>({
    type: MessageActions.GET_ALL_WANTED_VERSIONS_OF_ITEM,
    resource,
  });

export const getAllWantedVersionsByFormat = async (
  resource: string,
  format: Optional<Version["format"]>
) =>
  messageHandler<Optional<MasterRelease>>({
    type: MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT,
    resource,
    body: format,
  });

export const setHighglightedLabels = async (labels: {}) =>
  messageHandler<HightlightedLabels>({
    type: MessageActions.SET_HIGHTLIGHTED_LABELS,
    body: labels,
  }).then((it) => maybe(it).valueOr(labels));

export const getHighglightedLabels = async () =>
  messageHandler<HightlightedLabels>({
    type: MessageActions.GET_HIGHTLIGHTED_LABELS,
  }).then((it) => maybe(it).valueOr({}));
