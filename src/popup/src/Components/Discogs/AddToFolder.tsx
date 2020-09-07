import React, { ChangeEvent } from 'react'
import { addReleaseAction, Folder, folders } from '../../constants'
import { sendChromeMessage } from '../../service/messages'
import { Select } from './inputs'

const sendSelectedFolderMessage = (e: ChangeEvent) =>
    folders
        .filter(
            ({ folder_id: id }) =>
                id === parseInt((e.target as HTMLSelectElement).value)
        )
        .map((folder) => sendChromeMessage(addReleaseAction.action, folder))

const AddToFolder = () => (
    <Select onChange={sendSelectedFolderMessage}>
        {folders.map(({ folder_id: id, name }: Folder) => (
            <option key={`folderId-${id}`} value={id}>
                {name}
            </option>
        ))}
    </Select>
)

export default AddToFolder
