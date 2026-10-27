import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { startLenis } from './lib/motion';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
startLenis();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
