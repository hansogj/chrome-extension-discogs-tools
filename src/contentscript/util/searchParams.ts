import { defined } from 'array.defined'

interface Hash<T> {
    [key: string]: T
}

export const getSearchParams = () =>
    window.location.search
        .replace('?', '')
        .split('&')
        .reduce((res, sarch) => {
            const [key, val] = sarch.split(/=/)
            res[key] = val
            return res
        }, {} as Hash<string>)

export const serialize = (params: Hash<string>) =>
    Object.entries(params)
        .filter(([key, val]) => defined(key) && defined(val))
        .map(([key, val]) => [key, val].join('='))
        .join('&')

export const search = (params: Hash<string>) =>
    window.location.replace(
        [
            window.location.href.split('?').shift(),
            serialize({
                ...getSearchParams(),
                ...params,
            }),
        ].join('?')
    )
