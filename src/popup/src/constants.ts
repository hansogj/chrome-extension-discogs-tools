export interface Folder {
    folder_id?: number
    name: string
}

export const folders: Folder[] = [
    { name: 'Add to Folder' },
    { folder_id: 653066, name: 'LP HoG' },
    { folder_id: 653067, name: 'CD HoG' },
    { folder_id: 653068, name: 'CD Ingvill' },
    { folder_id: 506841, name: 'Dumps' },
    { folder_id: 779607, name: 'Dupletter' },
    { folder_id: 1687712, name: 'LP Barn' },
    { folder_id: 1687713, name: 'LP Film' },
    { folder_id: 1193739, name: 'LP HoG - boden' },
    { folder_id: 1516801, name: 'LP HoG - klassisk boden' },
    { folder_id: 729999, name: 'LP Ingvill' },
    { folder_id: 497111, name: 'LP Maus' },
    { folder_id: 1193563, name: 'LP Maus - Boden' },
    { folder_id: 939142, name: 'LP Olaf' },
    { folder_id: 497112, name: 'LP Olaf Skiaker' },
    { folder_id: 1555346, name: 'LP Olaf Skiaker Boden' },
    { folder_id: 848675, name: 'LP Tora' },
]

export enum LoadAction {
    AddToWantlist = 'addToWantlist',
}

export type ActionType =
    | 'uniqueSeller'
    | 'uniqueRelease'
    | 'addRelease'
    | 'filterAndAddToWantlist'
    | 'addToWantlist'
    | 'removeFromWantlist'
    | 'changePlacement'
    | 'changeOrigin'

export interface Action {
    action: ActionType
    title: string
    options?: any
}

export const uniqueSellerAction: Action = {
    action: 'uniqueSeller',
    title: 'Filter seller',
}
export const uniqueReleaseAction: Action = {
    action: 'uniqueRelease',
    title: 'Filter Release',
}
export const addReleaseAction: Action = {
    action: 'addRelease',
    title: 'Add to collection',
}

export const filterAndAddToWantlistAction: Action = {
    action: 'filterAndAddToWantlist',
    title: 'Filter and Add to wantlist',
    options: { format: 'Vinyl' },
}
export const addToWantlistAction: Action = {
    action: 'addToWantlist',
    title: 'Wantlist +',
}

export const removeFromWantlistAction: Action = {
    action: 'removeFromWantlist',
    title: 'Wantlist -',
}

export const changePlacement: Action = {
    action: 'changePlacement',
    title: 'Change Placement',
}
