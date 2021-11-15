import { Origin, Placement } from '../popup/src/constants'
import { collUpdate } from './api'
import find from './util/find'

const placementFields = (coll_id: string, val: Placement) => ({
    fieldId: '5',
    coll_id,
    val,
})

const originFields = (coll_id: string, val: Origin) => ({
    fieldId: '4',
    coll_id,
    val,
})
type ChangeField =
    | ReturnType<typeof placementFields>
    | ReturnType<typeof originFields>
export const changeField = ({ fieldId, coll_id, val }: ChangeField) =>
    collUpdate(
        `coll_id=${coll_id}&field_id=${fieldId}&folder_id=&val=${val}%0A&notes=${val}%0A`
    )

const fromAllIds = (cb: (val: string) => Promise<any>) =>
    Promise.all(
        Array.from(find('[name=collection_ids]'))
            .map((input: HTMLInputElement) => input.value)
            .map(cb)
    )
        .then(console.log)
        .then(() => window.location.reload())
        .catch(console.error)

export const changePlacement = ({ placement }: { placement: Placement }) =>
    fromAllIds((itemId) => changeField(placementFields(itemId, placement)))

export const changeOrigin = ({ origin }: { origin: Origin }) =>
    fromAllIds((itemId) => changeField(originFields(itemId, origin)))
