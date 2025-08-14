import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load auth components
const LoginForm = React.lazy(() => import('../components/LoginForm'));
const RegisterForm = React.lazy(() => import('../components/RegisterForm'));
const OTPLoginForm = React.lazy(() => import('../components/OTPLoginForm'));
const MagicLinkLoginForm = React.lazy(() => import('../components/MagicLinkLoginForm'));
const MagicLinkLoginPage = React.lazy(() => import('../components/MagicLinkLoginPage'));
const ForgotPasswordForm = React.lazy(() => import('../components/ForgotPasswordForm'));
const ResetPasswordForm = React.lazy(() => import('../components/ResetPasswordForm'));
const EmailVerificationPage = React.lazy(() => import('../components/EmailVerificationPage'));
const EmailVerificationNotice = React.lazy(() => import('../components/EmailVerificationNotice'));

// Fallback component for loading
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <LoadingSpinner size={40} />
  </div>
);

const AuthRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login/otp" element={<OTPLoginForm />} />
        <Route path="/login/magic-link" element={<MagicLinkLoginForm />} />
        <Route path="/magic-login" element={<MagicLinkLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        
        {/* Email Verification Routes */}
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route 
          path="/verify-email-notice" 
          element={
            <ProtectedRoute>
              <EmailVerificationNotice />
            </ProtectedRoute>
          } 
        />
        
        {/* Resend Verification (separate route for non-authenticated users) */}
        <Route 
          path="/resend-verification" 
          element={<MagicLinkLoginForm />} // Reuse the component for simplicity
        />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
