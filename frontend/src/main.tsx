import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Initialize Enterprise Systems
import { initPerformanceMonitoring } from './observability/performanceMonitor';
import { initDevToolsMonitor } from './security/DevToolsMonitor';
import { initInteractionMonitor } from './security/InteractionMonitor';

// Boot Sequence
initPerformanceMonitoring();
initDevToolsMonitor();
initInteractionMonitor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
