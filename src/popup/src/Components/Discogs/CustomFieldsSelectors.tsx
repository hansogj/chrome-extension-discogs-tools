import React, { ChangeEvent } from 'react'
import {
    changeOrigin,
    changePlacement,
    origins,
    placements,
} from '../../constants'
import { sendChromeMessage } from '../../service/messages'
import { Select } from './inputs'

const selectOrigin = (e: ChangeEvent<HTMLSelectElement>) =>
    sendChromeMessage(changeOrigin.action, { origin: e.target.value })
const selectPlacement = (e: ChangeEvent<HTMLSelectElement>) =>
    sendChromeMessage(changePlacement.action, { placement: e.target.value })

export const ChangeOrigin = () => (
    <Select onChange={selectOrigin}>
        {[changeOrigin.title].concat(origins).map((origin) => (
            <option key={`origin-${origin}`} value={origin}>
                {origin}
            </option>
        ))}
    </Select>
)

export const ChangePlacement = () => (
    <Select onChange={selectPlacement}>
        {[changePlacement.title].concat(placements).map((placement) => (
            <option key={`placement-${placement}`} value={placement}>
                {placement}
            </option>
        ))}
    </Select>
)
