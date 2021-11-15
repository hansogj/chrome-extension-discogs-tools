import React from 'react'
import {
    Action,
    addToWantlistAction,
    filterAndAddToWantlistAction,
    removeFromWantlistAction,
    uniqueReleaseAction,
    uniqueSellerAction,
} from '../../constants'
import { sendChromeMessage } from '../../service/messages'
import { colors, Column, ContentBody, Row } from '../styled'
import AddToFolder from './AddToFolder'
import { ChangeOrigin, ChangePlacement } from './CustomFieldsSelectors'
import { Button } from './inputs'

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

        <Row>
            <Column>
                <ChangeOrigin />
            </Column>
            <Column>
                <ChangePlacement />
            </Column>
        </Row>
    </ContentBody>
)

export default DiscogsActions
