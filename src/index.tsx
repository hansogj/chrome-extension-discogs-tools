import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './popup/App';
import './index.css';

import { isProduction } from './constants';
import { store } from './services/redux';
import { MockLinks } from './services/__mock__/page.in.view';

const Root = () => (
  <Provider store={store}>
    <App />
    {!isProduction && <MockLinks />}
  </Provider>
);
createRoot(document.getElementById('root')!).render(<Root />);
