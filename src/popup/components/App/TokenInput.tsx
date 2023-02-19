import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { DispatchAction } from '../../../services/redux/store';
import { UserActionTypes } from '../../../services/redux/user';
import { getTexts } from '../../../services/texts';
import { base, Card, Column, ContentBody, Input, Row, Submit as StyledSubmit } from '../../styled';

export interface TokenInputProps {
  setUserToken: DispatchAction<Pick<UserActionTypes, 'userToken'>>;
}

const Submit = styled(StyledSubmit)`
  margin-top: calc(${base} * 4);
`;

const TokenInput: FC<TokenInputProps> = ({ setUserToken }: TokenInputProps) => {
  const [token, setToken] = useState<string>('');
  const [title, __html, href, linkText, placeholder, submit] = getTexts(
    'token.info.title',
    'token.info.ingress',
    'token.info.link.url',
    'token.info.link.text',
    'token.input.placeholder',
    'token.input.submit',
  );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setUserToken({ userToken: token });
    }
  };
  return (
    <ContentBody filled>
      <Row>
        <Column width={20}>
          <Card>
            <h3>{title}</h3>
            <div>
              <p dangerouslySetInnerHTML={{ __html }} />
              <a aria-label={linkText} href={href} title="developer token">
                {linkText}
              </a>
            </div>
          </Card>
        </Column>
        <Column width={5} />
        <Column width={20}>
          <Card>
            <Input
              type="text"
              width={18}
              placeholder={placeholder}
              value={token}
              onKeyPress={handleKeyPress}
              onChange={(e) => setToken(e.target.value)}
            ></Input>
            <Submit onClick={() => setUserToken({ userToken: token })}>{submit}</Submit>
          </Card>
        </Column>
      </Row>
    </ContentBody>
  );
};

export default TokenInput;
