import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { Toaster } from 'sonner'; // Import Toaster

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster /> {/* Add Toaster component */}
  </React.StrictMode>
);

