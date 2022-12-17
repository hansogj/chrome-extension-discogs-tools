import maybe from '@hansogj/maybe';

import * as userToken from './userToken.service';
import { empty } from './utils/json.utils';
import { rejection, sleep } from './call.stack';

const serialize = (obj: Record<string, string | number>): string =>
  Object.keys(obj)
    .reduce((a, k) => a.concat(`${k}=${encodeURIComponent(obj[k])}`), [] as string[])
    .join('&');

const mergeWithToken = (it: SearchParams, token: string) => ({
  ...it,
  ...(!empty(token) && { token }),
});

const url = (resource: string, params?: SearchParams) =>
  userToken.get().then((token) =>
    maybe(params)
      .orJust({} as SearchParams)
      .map((it) => mergeWithToken(it, token!))
      .map((it) => serialize(it))
      .map((it) => (it ? `${resource}?${it}` : resource))
      .valueOr(resource),
  );

const unRest = (response: Response) =>
  (response.status >= 200 && response.status < 300
    ? Promise.resolve(response.json())
    : Promise.reject(new Error(response.statusText))
  ).catch(() => Promise.resolve(response.text()));

const call = async (method: 'DELETE' | 'GET' | 'POST' | 'PUT', uri: string, body = {}) => {
  return sleep(uri)
    .then(() =>
      fetch(uri, {
        method,
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        ...(method !== 'GET' && !!body && { body: JSON.stringify(body) }),
      }),
    )
    .then(unRest);
};

export const get = async (resource: string, params?: SearchParams) =>
  url(resource, params)
    .then((uri) => call('GET', uri))
    .catch(rejection);

export const deleteResource = async (resource: string) =>
  url(resource).then((deleteUrl) => fetch(deleteUrl, { method: 'DELETE' }));

export const post = async (resource: string, paramsAndPayload?: SearchParams & PayLoad) => {
  const { payLoad, ...body } = maybe(paramsAndPayload as SearchParams & PayLoad).valueOr({
    payLoad: {},
  });
  return url(resource, body as SearchParams).then((uri) => call('POST', uri, payLoad));
};

export const put = async (resource: string, paramsAndPayload?: SearchParams & PayLoad) => {
  const { payLoad, ...body } = maybe(paramsAndPayload as SearchParams & PayLoad).valueOr({
    payLoad: {},
  });
  return url(resource, body as SearchParams).then((uri) => call('PUT', uri, payLoad));
};
