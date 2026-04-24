// src/index.js
// React app entry point

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Bootstrap CSS and Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
