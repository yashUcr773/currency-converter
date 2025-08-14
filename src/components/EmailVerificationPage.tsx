import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, error, clearError } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage(t('auth.verification.noToken', 'Invalid verification link'));
      return;
    }

    const verifyToken = async () => {
      try {
        clearError();
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
      } catch (error) {
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'Verification failed';
        setMessage(errorMessage);
      }
    };

    verifyToken();
  }, [searchParams, verifyEmail, clearError, t]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {status === 'verifying' && t('auth.verification.verifying', 'Verifying your email')}
            {status === 'success' && t('auth.verification.success', 'Email verified!')}
            {status === 'error' && t('auth.verification.failed', 'Verification failed')}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'verifying' && t('auth.verification.verifyingSubtitle', 'Please wait while we verify your email address')}
            {status === 'success' && t('auth.verification.successSubtitle', 'Your email has been successfully verified')}
            {status === 'error' && t('auth.verification.failedSubtitle', 'There was a problem verifying your email')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {status === 'verifying' && (
            <div className="text-center p-6">
              <LoadingSpinner size={40} className="mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('auth.verification.processing', 'Processing your verification...')}
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button onClick={handleContinue} className="w-full">
                {t('auth.verification.continue', 'Continue to app')}
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message || error}</AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Link to="/resend-verification">
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('auth.verification.resendLink', 'Resend verification email')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    {t('auth.verification.backToLogin', 'Back to login')}
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

export default EmailVerificationPage;
