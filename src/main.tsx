import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logger, env } from './utils/env'

// Log app startup in development
logger.log(`Currency Converter Pro v${env.version} starting...`);
logger.log(`Environment: ${env.isProduction ? 'Production' : 'Development'}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
