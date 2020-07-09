import React from 'react';
import DiscogsActions from '../Discogs';
import { Container, Content } from '../styled';
import AppHeader from './App.header';

function App() {
  return (
    <Container>
      <Content>
        <AppHeader />
        <DiscogsActions />
      </Content>
    </Container>
  );
}

export default App;
