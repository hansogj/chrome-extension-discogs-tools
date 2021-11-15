import { collUpdate } from './api'
import find from './util/find'

type Placement = 'Oppe' | 'Nede' | 'Boden'
type Origin = 'Self' | 'Maus' | 'Skiaker'

const changePlacement = (coll_id: string, val: Placement) => ({
    fieldId: '5',
    coll_id,
    val,
})

const changeOrigin = (coll_id: string, val: Origin) => ({
    fieldId: '5',
    coll_id,
    val,
})
type ChangeField =
    | ReturnType<typeof changePlacement>
    | ReturnType<typeof changeOrigin>
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
        .catch(console.error)

export const flyttTil = (placement: Placement) =>
    fromAllIds((itemId) => changeField(changePlacement(itemId, placement)))

export const setOpphav = (origin: Origin) =>
    fromAllIds((itemId) => changeField(changeOrigin(itemId, origin)))
