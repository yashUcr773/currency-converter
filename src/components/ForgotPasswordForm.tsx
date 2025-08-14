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
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { forgotPassword, loading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
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
      await forgotPassword(email);
      setIsEmailSent(true);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      // Error is handled by the context
      console.error('Password reset request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    clearError();

    try {
      await forgotPassword(email);
      setCountdown(60);
    } catch (error) {
      console.error('Resend password reset failed:', error);
    }
  };

  const handleBack = () => {
    setIsEmailSent(false);
    clearError();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            {isEmailSent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle className="text-2xl flex-1 text-center">
              {isEmailSent 
                ? t('auth.forgotPassword.sentTitle', 'Check your email')
                : t('auth.forgotPassword.title', 'Forgot password?')
              }
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            {isEmailSent 
              ? t('auth.forgotPassword.sentSubtitle', 'We\'ve sent you a password reset link')
              : t('auth.forgotPassword.subtitle', 'Enter your email to reset your password')
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

          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('auth.fields.email', 'Email address')}
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
                <p className="text-xs text-muted-foreground">
                  {t('auth.forgotPassword.helpText', 'We\'ll send you a secure link to reset your password')}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!email || isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {t('auth.forgotPassword.sending', 'Sending reset link...')}
                  </>
                ) : (
                  t('auth.forgotPassword.sendLink', 'Send reset link')
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
                  {t('auth.forgotPassword.emailSent', 'Reset link sent!')}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('auth.forgotPassword.checkEmail', 'Check your email and follow the instructions to reset your password. The link will expire in 30 minutes.')}
                </p>
                <div className="text-xs text-muted-foreground bg-muted rounded p-2">
                  <strong>{email}</strong>
                </div>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.forgotPassword.emailNote', 'If you don\'t see the email in your inbox, check your spam folder.')}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground text-center">
                  {t('auth.forgotPassword.noEmail', "Didn't receive the email?")}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className="w-full"
                >
                  {countdown > 0 
                    ? t('auth.forgotPassword.resendIn', `Resend in ${countdown}s`)
                    : t('auth.forgotPassword.resend', 'Resend reset link')
                  }
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {t('auth.forgotPassword.rememberPassword', 'Remember your password?')}{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.forgotPassword.signIn', 'Sign in')}
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

export default ForgotPasswordForm;
