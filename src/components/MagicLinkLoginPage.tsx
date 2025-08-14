import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

const MagicLinkLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithMagicLink, error, clearError, isAuthenticated } = useAuth();

  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
  const [rememberMe, setRememberMe] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      return;
    }

    // Token is valid, show the login confirmation
    setStatus('ready');
  }, [searchParams]);

  const handleLogin = async () => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      const response = await loginWithMagicLink(token, rememberMe);
      setStatus('success');
      
      // Redirect after a brief delay
      setTimeout(() => {
        if (response.requiresEmailVerification) {
          navigate('/verify-email-notice');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (error) {
      setStatus('error');
      console.error('Magic link login failed:', error);
    } finally {
      setIsProcessing(false);
    }
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
          <CardTitle className="text-2xl">
            {status === 'loading' && t('auth.magicLink.validating', 'Validating magic link')}
            {status === 'ready' && t('auth.magicLink.readyTitle', 'Complete your sign-in')}
            {status === 'success' && t('auth.magicLink.successTitle', 'Sign-in successful!')}
            {status === 'error' && t('auth.magicLink.errorTitle', 'Invalid magic link')}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && t('auth.magicLink.validatingSubtitle', 'Please wait while we validate your magic link')}
            {status === 'ready' && t('auth.magicLink.readySubtitle', 'Click the button below to complete your sign-in')}
            {status === 'success' && t('auth.magicLink.successSubtitle', 'You are being redirected...')}
            {status === 'error' && t('auth.magicLink.errorSubtitle', 'This magic link is invalid or expired')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {status === 'loading' && (
            <div className="text-center p-6">
              <LoadingSpinner size={40} className="mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('auth.magicLink.processing', 'Processing your magic link...')}
              </p>
            </div>
          )}

          {status === 'ready' && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  {t('auth.magicLink.readyMessage', 'Your magic link is valid. Complete your sign-in by clicking the button below.')}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('auth.login.rememberMe', 'Remember me for 30 days')}
                </Label>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {t('auth.magicLink.signingIn', 'Signing in...')}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {t('auth.magicLink.completeSignIn', 'Complete sign-in')}
                  </>
                )}
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.magicLink.loginSuccess', 'You have been successfully signed in!')}
                </AlertDescription>
              </Alert>
              <LoadingSpinner size={20} className="mx-auto" />
            </div>
          )}

          {status === 'error' && (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || t('auth.magicLink.invalidLink', 'This magic link is invalid, expired, or has already been used.')}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Link to="/login/magic-link">
                  <Button variant="outline" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    {t('auth.magicLink.requestNew', 'Request new magic link')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    {t('auth.magicLink.backToLogin', 'Back to login')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MagicLinkLoginPage;
