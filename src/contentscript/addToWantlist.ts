import { defined } from 'array.defined'
import { LoadAction } from '../popup/src/constants'
import * as api from './api'
import { Item } from './model'
import find from './util/find'
import getReleaseId from './util/getReleaseId'
import { search } from './util/searchParams'

const getMasterId = (): number =>
    window.location.pathname
        .split('/')
        .filter((i: any) => !isNaN(i))
        .defined()
        .map(parseInt)
        .pop()

const getListOfItems = (isInWantlist: boolean): any[] =>
    find('.react-modal-content .card.react-card')
        .filter(
            (card) => defined(find('.icon-wantlist', card)) === isInWantlist
        )
        .flatMap((card) => find('a.search_result_title', card))
        .map((a: HTMLAnchorElement) => a.href)
        .map((url: string) => getReleaseId(url))
        .map((id: number) => ({ id, master_id: getMasterId() }))

const done = () =>
    search({
        loadAction: undefined,
        filter: undefined,
        format: undefined,
    })

export const removeFromWantlist = () =>
    Promise.all(
        getListOfItems(true).map((item: Item) =>
            api.removeItemFromWantlist(item)
        )
    ).then(done)

export const filterAndAddToWantlist = ({ format }) =>
    search({
        loadAction: LoadAction.AddToWantlist,
        filter: 'true',
        format,
    })

export const addToWantlist = () => {
    setTimeout(
        () =>
            Promise.all(
                getListOfItems(false).map((item: Item) =>
                    api.addItemToWantList(item)
                )
            ).then(done),
        2000
    )
}
