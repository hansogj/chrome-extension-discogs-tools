import React from 'react';
import { ContentBody, Row, Column } from '../styled';
import AddToFolder from './AddToFolder';
import { Button } from './inputs';
import { sendChromeMessage } from '../../service/messages';

import {
  uniqeSellerAction,
  uniqeReleaseAction,
  addToWantlistAction,
  removeFromWantlistAction,
} from '../../constants';

const DiscogsActions = () => {
  return (
    <ContentBody>
      <Row>
        <Column>
          <Button onClick={() => sendChromeMessage(uniqeSellerAction)}>
            {uniqeSellerAction.title}
          </Button>
        </Column>
        <Column>
          <Button onClick={() => sendChromeMessage(uniqeReleaseAction)}>
            {uniqeReleaseAction.title}
          </Button>
        </Column>
      </Row>

      <Row>
        <Column>
          <Button onClick={() => sendChromeMessage(addToWantlistAction)}>
            Wantlist +
          </Button>
        </Column>
        <Column>
          <Button
            onClick={() => sendChromeMessage(removeFromWantlistAction)}
            style={{ backgroundColor: '#880000' }}
          >
            Wantlist -
          </Button>
        </Column>
      </Row>

      <Row>
        <AddToFolder />
      </Row>
    </ContentBody>
  );
};

export default DiscogsActions;
