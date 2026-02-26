import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Clear old cached data to load new products (v2)
const cacheVersion = localStorage.getItem('app_version');
if (cacheVersion !== 'v2-88products') {
  localStorage.clear();
  localStorage.setItem('app_version', 'v2-88products');
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