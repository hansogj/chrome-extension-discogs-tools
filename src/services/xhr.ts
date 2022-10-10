import maybe from '@hansogj/maybe';
import axios, { AxiosResponse } from 'axios';
import * as userToken from './userToken.service';
import { empty } from './utils/json.utils';

import adapter from '@vespaiach/axios-fetch-adapter';

let stack: number[] = [];
export const stdDelay = 200;
export const __resetStack = () => (stack = []);
export const rateLimit = 60;

export const getDelay = () => {
  const timestamp = Date.now();
  stack.unshift(timestamp);
  let actualDelay = stack && stack.length > rateLimit ? 500 : stdDelay;
  return maybe(stack)
    .map((it) => it[rateLimit - 2])
    .nothingUnless(Boolean)
    .map((it) => timestamp - it)
    .nothingIf((it) => it < actualDelay)
    .map((it) => rateLimit * 1200 - it)
    .nothingIf((it) => it < actualDelay)
    .valueOr(actualDelay);
};

const sleep = (delay = getDelay()) =>
  new Promise<number>((resolve, reject) => setTimeout(() => resolve(delay), delay));

const unRest = ({ data }: AxiosResponse) => data;
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

export const fetch = async (resource: string, params?: SearchParams) => {
  return sleep()
    .then((delay) =>
      console.log(`Calling ${resource} after ${delay} millis: ${Date.now()} `, {
        size: stack.length,
        last: maybe(stack)
          .map((it) => it[0])
          .map((it) => new Date(it))
          .map((it) => [it.getSeconds(), it.getMilliseconds()].join(':'))
          .valueOr('undef'),
        delay,
      }),
    )
    .then(() => url(resource, params))
    .then((u) => axios.get(u, { adapter }))
    .then(unRest)
    .catch((e) => {
      return Promise.reject({
        latest: stack[0],
        rateLimit: stack[rateLimit - 1],
      });
    });
};

export const deleteResource = async (resource: string) =>
  url(resource).then(axios.delete).then(unRest);

export const post = async (resource: string, paramsAndPayload?: SearchParams & PayLoad) => {
  const { payLoad, ...body } = maybe(paramsAndPayload as SearchParams & PayLoad).valueOr({
    payLoad: undefined,
  });
  return url(resource, body as SearchParams)
    .then((postUrl) => axios.post(postUrl, payLoad))
    .then(unRest);
};

export const put = async (resource: string, paramsAndPayload?: SearchParams & PayLoad) => {
  const { payLoad, ...body } = maybe(paramsAndPayload as SearchParams & PayLoad).valueOr({
    payLoad: undefined,
  });
  return url(resource, body as SearchParams)
    .then((putUrl) => axios.put(putUrl, payLoad))
    .then(unRest);
};
