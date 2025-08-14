import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { Mail, Zap, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const MagicLinkLoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestMagicLink, loading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);
    clearError();

    try {
      await requestMagicLink(email);
      setIsLinkSent(true);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      // Error is handled by the context
      console.error('Magic link request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendLink = async () => {
    if (countdown > 0) return;

    clearError();

    try {
      await requestMagicLink(email);
      setCountdown(60);
    } catch (error) {
      console.error('Resend magic link failed:', error);
    }
  };

  const handleBack = () => {
    setIsLinkSent(false);
    clearError();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLinkSent 
              ? t('auth.magicLink.sentTitle', 'Check your email')
              : t('auth.magicLink.title', 'Sign in with Magic Link')
            }
          </CardTitle>
          <CardDescription className="text-center">
            {isLinkSent 
              ? t('auth.magicLink.sentSubtitle', 'We\'ve sent you a secure sign-in link')
              : t('auth.magicLink.subtitle', 'We\'ll send you a secure link to sign in')
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLinkSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('auth.fields.email', 'Email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('auth.fields.emailPlaceholder', 'Enter your email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!email || isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {t('auth.magicLink.sending', 'Sending link...')}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {t('auth.magicLink.sendLink', 'Send magic link')}
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t('auth.magicLink.linkSent', 'Magic link sent!')}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('auth.magicLink.checkEmail', 'Check your email and click the secure link to sign in. The link will expire in 15 minutes.')}
                </p>
                <div className="text-xs text-muted-foreground bg-muted rounded p-2">
                  <strong>{email}</strong>
                </div>
              </div>

              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.magicLink.clickLink', 'Click the link in your email to continue. You can close this tab once you\'ve clicked the link.')}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground text-center">
                  {t('auth.magicLink.noEmail', "Didn't receive the email?")}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendLink}
                    disabled={countdown > 0}
                    className="w-full"
                  >
                    {countdown > 0 
                      ? t('auth.magicLink.resendIn', `Resend in ${countdown}s`)
                      : t('auth.magicLink.resend', 'Resend magic link')
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="w-full"
                  >
                    {t('auth.magicLink.tryDifferentEmail', 'Try a different email')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {t('auth.magicLink.backToLogin', 'Want to use password instead?')}{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.magicLink.passwordLogin', 'Password login')}
            </Link>
          </div>
          
          <div className="text-sm text-center">
            {t('auth.login.noAccount', "Don't have an account?")}{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.login.signUp', 'Sign up')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MagicLinkLoginForm;
