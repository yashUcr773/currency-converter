import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NumberSystemProvider } from './contexts/NumberSystemContext'
import { logger, env } from './utils/env'

// Log app startup in development
logger.log(`Currency Converter Pro v${env.version} starting...`);
logger.log(`Environment: ${env.isProduction ? 'Production' : 'Development'}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <NumberSystemProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </NumberSystemProvider>
    </ErrorBoundary>
  </StrictMode>,
)
