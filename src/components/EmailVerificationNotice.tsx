import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

const EmailVerificationNotice: React.FC = () => {
  const { t } = useTranslation();
  const { user, resendVerification, error, clearError } = useAuth();
  
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    if (!user?.email || countdown > 0) return;

    setIsResending(true);
    clearError();
    setResendSuccess(false);

    try {
      await resendVerification(user.email);
      setResendSuccess(true);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      console.error('Resend verification failed:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t('auth.verification.noticeTitle', 'Verify your email')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.verification.noticeSubtitle', 'Check your email to complete your registration')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-muted/50 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t('auth.verification.checkInbox', 'Check your inbox')}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('auth.verification.emailSent', 'We\'ve sent a verification email to:')}
            </p>
            {user?.email && (
              <div className="text-sm font-medium bg-muted rounded p-2 mb-4">
                {user.email}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('auth.verification.clickLink', 'Click the link in the email to verify your account. The link will expire in 24 hours.')}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('auth.verification.resendSuccess', 'Verification email sent successfully!')}
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              {t('auth.verification.spamNote', 'If you don\'t see the email in your inbox, check your spam folder.')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              {t('auth.verification.noEmail', "Didn't receive the email?")}
            </div>
            <Button
              variant="outline"
              onClick={handleResendVerification}
              disabled={countdown > 0 || isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  {t('auth.verification.resending', 'Sending...')}
                </>
              ) : countdown > 0 ? (
                t('auth.verification.resendIn', `Resend in ${countdown}s`)
              ) : (
                t('auth.verification.resend', 'Resend verification email')
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            <Link
              to="/"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.verification.continueWithoutVerification', 'Continue to app')}
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              {t('auth.verification.limitedAccess', 'Some features may be limited until you verify your email')}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerificationNotice;
