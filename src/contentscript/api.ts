import axios from 'axios'
import { Item, Release, Update } from './model'

const error = (e) => {
    debugger
    return console.error(e), e
}

const serialize = (obj: Object): string =>
    Object.keys(obj)
        .reduce((a, k) => {
            a.push(k + '=' + encodeURIComponent(obj[k]))
            return a
        }, [])
        .join('&')

const unRest = (response) => response.data
type Path = string | number
const buildUrl = (...path: Path[]) =>
    ['https://www.discogs.com'].concat(path as string[]).join('/')

export const update = (release: Update): Promise<Release> =>
    axios
        .post(buildUrl('list', 'coll_update'), serialize(release))
        .then(unRest)
        .catch(error)

export const addToCollection = (release_id: number): Promise<Release> =>
    axios
        .post(buildUrl('_rest', 'collection'), { release_id })
        .then(unRest)
        .catch(error)

export const addItemToWantList = (item: Item) =>
    axios.put(buildUrl('_rest', 'wantlist', item.id), item)

export const removeItemFromWantlist = (item) =>
    axios.delete(buildUrl('_rest', 'wantlist', item.id), item)

export const collUpdate = (body: string) =>
    fetch('https://www.discogs.com/list/coll_update', {
        headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'accept-language':
                'en-NO,en;q=0.9,nb-NO;q=0.8,nb;q=0.7,en-US;q=0.6,no;q=0.5',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-ch-ua':
                '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://www.discogs.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: body,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
