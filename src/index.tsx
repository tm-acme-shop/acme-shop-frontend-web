import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { logger } from './logging/logger';

console.log('App starting...'); // TODO(TEAM-FRONTEND): Remove console.log once logger usage is consistent
logger.info('App starting', { event: 'app_start' });

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
