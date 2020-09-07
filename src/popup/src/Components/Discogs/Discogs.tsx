import React from 'react'
import { ContentBody, Row, Column, colors } from '../styled'
import AddToFolder from './AddToFolder'
import { Button } from './inputs'
import { sendChromeMessage } from '../../service/messages'

import {
    uniqueSellerAction,
    uniqueReleaseAction,
    addToWantlistAction,
    removeFromWantlistAction,
    filterAndAddToWantlistAction,
    Action,
} from '../../constants'

interface ActionButtonProps extends Action {
    style?: React.CSSProperties
}

const ActionButton = ({ action, title, options, style }: ActionButtonProps) => (
    <Button style={style} onClick={() => sendChromeMessage(action, options)}>
        {title}
    </Button>
)

const DiscogsActions = () => (
    <ContentBody>
        <Row>
            <Column>
                <ActionButton {...uniqueSellerAction} />
            </Column>
            <Column>
                <ActionButton {...uniqueReleaseAction} />
            </Column>
        </Row>

        <Row>
            <Column>
                <ActionButton {...addToWantlistAction} />
            </Column>
            <Column>
                <ActionButton
                    {...{
                        ...removeFromWantlistAction,
                        ...{ style: { backgroundColor: colors.dread } },
                    }}
                />
            </Column>
        </Row>
        <Row>
            <Column>
                <ActionButton
                    {...{
                        ...filterAndAddToWantlistAction,
                        ...{ style: { backgroundColor: colors.kindOfBlue } },
                    }}
                />
            </Column>

            <AddToFolder />
        </Row>
    </ContentBody>
)

export default DiscogsActions
