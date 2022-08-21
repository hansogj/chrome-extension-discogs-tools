import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { AppActionTypes } from '../../services/redux/app';
import { getTexts } from '../../services/texts';
import { Submit as StyledSubmit, Card, base, Column, ContentBody, Input, Row } from '../styled';

export interface TokenInputProps {
  setUserToken: Fn<[string], AppActionTypes>;
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
              onChange={(e) => setToken(e.target.value)}
            ></Input>
            <Submit onClick={() => setUserToken(token)}>{submit}</Submit>
          </Card>
        </Column>
      </Row>
    </ContentBody>
  );
};

export default TokenInput;
