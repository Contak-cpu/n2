import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Clear old cached data when version changes
const cacheVersion = localStorage.getItem('app_version');
if (cacheVersion !== 'v4-supermarket') {
  localStorage.clear();
  localStorage.setItem('app_version', 'v4-supermarket');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);