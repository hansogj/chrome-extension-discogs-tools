import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './popup/App'
import './index.css'

import { store } from './services/redux'

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)
createRoot(document.getElementById('root')!).render(<Root />)
