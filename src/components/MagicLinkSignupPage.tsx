import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircle, AlertCircle, Zap, ExternalLink } from 'lucide-react';

type MagicSignupStatus = 'loading' | 'ready' | 'success' | 'error';

const MagicLinkSignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeSignupWithMagicLink, loading, error, clearError, isAuthenticated } = useAuth();

  const [status, setStatus] = useState<MagicSignupStatus>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    const magicToken = searchParams.get('token');
    
    if (!magicToken) {
      setStatus('error');
      return;
    }

    setToken(magicToken);
    setStatus('ready');
  }, [isAuthenticated, navigate, searchParams]);

  const handleCompleteSignup = async () => {
    if (!token) return;

    setIsProcessing(true);
    clearError();

    try {
      await completeSignupWithMagicLink(token);
      setStatus('success');
      
      // Redirect after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Magic link signup failed:', error);
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAgain = () => {
    navigate('/register/magic-link');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Currency Converter
            </h1>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md mt-24 bg-white/95 backdrop-blur-md border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            {status === 'loading' && t('auth.magicSignup.validating', 'Validating signup link')}
            {status === 'ready' && t('auth.magicSignup.readyTitle', 'Complete your signup')}
            {status === 'success' && t('auth.magicSignup.successTitle', 'Welcome aboard!')}
            {status === 'error' && t('auth.magicSignup.errorTitle', 'Invalid signup link')}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && t('auth.magicSignup.validatingSubtitle', 'Please wait while we validate your signup link')}
            {status === 'ready' && t('auth.magicSignup.readySubtitle', 'Click the button below to create your account')}
            {status === 'success' && t('auth.magicSignup.successSubtitle', 'Your account has been created! Redirecting...')}
            {status === 'error' && t('auth.magicSignup.errorSubtitle', 'This signup link is invalid or expired')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === 'loading' && (
            <div className="text-center p-6">
              <LoadingSpinner size={40} className="mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('auth.magicSignup.processing', 'Processing your signup link...')}
              </p>
            </div>
          )}

          {status === 'ready' && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50/50 rounded-lg border border-blue-200/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">
                  {t('auth.magicSignup.readyToJoin', 'Ready to join?')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t('auth.magicSignup.oneClickSignup', 'Your account will be created with just one click. No password required!')}
                </p>
              </div>

              <Button
                onClick={handleCompleteSignup}
                disabled={isProcessing || loading}
                className="w-full"
                size="lg"
              >
                {isProcessing || loading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {t('auth.magicSignup.creating', 'Creating your account...')}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {t('auth.magicSignup.createAccount', 'Create My Account')}
                  </>
                )}
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center p-6 bg-green-50/50 rounded-lg border border-green-200/50">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-600/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800">
                {t('auth.magicSignup.accountCreated', 'Account created successfully!')}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {t('auth.magicSignup.redirecting', 'Welcome to Currency Converter! Redirecting you to the app...')}
              </p>
              <div className="flex justify-center">
                <LoadingSpinner size={20} />
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center p-6 bg-red-50/50 rounded-lg border border-red-200/50">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800">
                {t('auth.magicSignup.linkInvalid', 'Signup link invalid')}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {t('auth.magicSignup.linkExpiredOrInvalid', 'This signup link has expired or is invalid. Please request a new one.')}
              </p>
              <Button
                onClick={handleTryAgain}
                variant="outline"
                className="w-full"
              >
                {t('auth.magicSignup.requestNew', 'Request new signup link')}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {status !== 'success' && (
            <div className="text-sm text-center">
              {t('auth.magicSignup.hasAccount', 'Already have an account?')}{' '}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                {t('auth.magicSignup.signIn', 'Sign in')}
              </Link>
            </div>
          )}

          {status === 'success' && (
            <div className="text-sm text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                {t('auth.magicSignup.continueToApp', 'Continue to app')}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MagicLinkSignupPage;
