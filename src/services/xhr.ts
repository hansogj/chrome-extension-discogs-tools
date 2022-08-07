import axios, { AxiosResponse } from 'axios'
import maybe from 'maybe-for-sure'
import * as userToken from './userToken.service'
import { empty } from './utils/json.utils'

import adapter from '@vespaiach/axios-fetch-adapter'

const unRest = ({ data }: AxiosResponse) => data
const serialize = (obj: Record<string, string | number>): string =>
  Object.keys(obj)
    .reduce(
      (a, k) => a.concat(`${k}=${encodeURIComponent(obj[k])}`),
      [] as string[],
    )
    .join('&')

const mergeWithToken = (it: SearchParams, token: string) => ({
  ...it,
  ...(!empty(token) && { token }),
})

const url = (resource: string, params?: SearchParams) =>
  userToken.get().then((token) =>
    maybe(params)
      .orJust({} as SearchParams)
      .map((it) => mergeWithToken(it, token!))
      .map((it) => serialize(it))
      .map((it) => (it ? `${resource}?${it}` : resource))
      .valueOr(resource),
  )

export const fetch = async (resource: string, params?: SearchParams) =>
  url(resource, params)
    .then((u) => axios.get(u, { adapter }))
    .then(unRest)

export const deleteResource = async (resource: string) =>
  url(resource).then(axios.delete).then(unRest)

export const post = async (
  resource: string,
  paramsAndPayload?: SearchParams & PayLoad,
) => {
  const { payLoad, ...body } = maybe(
    paramsAndPayload as SearchParams & PayLoad,
  ).valueOr({ payLoad: undefined })
  return url(resource, body as SearchParams)
    .then((postUrl) => axios.post(postUrl, payLoad))
    .then(unRest)
}

export const put = async (
  resource: string,
  paramsAndPayload?: SearchParams & PayLoad,
) => {
  const { payLoad, ...body } = maybe(
    paramsAndPayload as SearchParams & PayLoad,
  ).valueOr({ payLoad: undefined })
  return url(resource, body as SearchParams)
    .then((putUrl) => axios.put(putUrl, payLoad))
    .then(unRest)
}
