import React, { Component } from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { createRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

serviceWorker.unregister();
