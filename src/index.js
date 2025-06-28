// index.js is the entry point of the React app.
// It renders the <App /> component into the root HTML element.
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'; // Load Bootstrap styles globally

import ReactDOM from 'react-dom/client';
import App from './App'; // Main app component
import './index.css'; // Optional: your global custom styles (can be blank or removed)

const root = ReactDOM.createRoot(document.getElementById('root')); // Get the root div in public/index.html

// Render the entire React app starting from <App />
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
