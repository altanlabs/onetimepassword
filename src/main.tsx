import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'

// Asegurarse de que el elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
}

ReactDOM.createRoot(rootElement ?? document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)