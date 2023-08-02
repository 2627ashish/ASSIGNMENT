import React from 'react';
import Home from './Component/Home';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Home/>
  </React.StrictMode>
);
reportWebVitals();
