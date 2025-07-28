import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { PrivacyPage } from './pages/PrivacyPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NumberSystemProvider } from './contexts/NumberSystemContext'
import { logger, env } from './utils/env'

// Log app startup in development
logger.log(`RateVault v${env.version} starting...`);
logger.log(`Environment: ${env.isProduction ? 'Production' : 'Development'}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <NumberSystemProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </BrowserRouter>
      </NumberSystemProvider>
    </ErrorBoundary>
  </StrictMode>,
)
