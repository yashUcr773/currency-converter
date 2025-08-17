import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import { AboutPage } from './pages/AboutPage.tsx'
import { PrivacyPage } from './pages/PrivacyPage.tsx'
import { SignInPage } from './pages/SignInPage.tsx'
import { SignUpPage } from './pages/SignUpPage.tsx'
import { UserProfilePage } from './pages/UserProfilePage.tsx'
import { UserSettingsPage } from './pages/UserSettingsPage.tsx'
import { JoinPage } from './pages/JoinPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NumberSystemProvider } from './contexts/NumberSystemContext'
import { ClerkWrapper } from './components/ClerkWrapper'
import { logger, env } from './utils/env'

// Log app startup in development
logger.log(`RateVault v${env.version} starting...`);
logger.log(`Environment: ${env.isProduction ? 'Production' : 'Development'}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkWrapper>
        <NumberSystemProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/user-profile/*" element={<UserProfilePage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
            </Routes>
          </BrowserRouter>
        </NumberSystemProvider>
      </ClerkWrapper>
    </ErrorBoundary>
  </StrictMode>,
)
