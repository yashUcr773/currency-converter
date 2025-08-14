import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { Mail, Shield, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const OTPLoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestOTP, loginWithOTP, loading, error, clearError, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);
    clearError();
    setSuccessMessage('');

    try {
      const response = await requestOTP(email);
      setSuccessMessage(response.message);
      setStep('otp');
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      // Error is handled by the context
      console.error('OTP request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginWithOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) return;

    setIsSubmitting(true);
    clearError();

    try {
      const response = await loginWithOTP(email, otp, rememberMe);
      
      if (response.requiresEmailVerification) {
        navigate('/verify-email-notice');
      } else {
        navigate('/');
      }
    } catch (error) {
      // Error is handled by the context
      console.error('OTP login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    clearError();
    setSuccessMessage('');

    try {
      const response = await requestOTP(email);
      setSuccessMessage(response.message);
      setCountdown(60);
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtp('');
    clearError();
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            {step === 'otp' && (
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
              {step === 'email' 
                ? t('auth.otp.title', 'Sign in with OTP')
                : t('auth.otp.verifyTitle', 'Enter OTP')
              }
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            {step === 'email' 
              ? t('auth.otp.subtitle', 'We\'ll send you a one-time password')
              : t('auth.otp.verifySubtitle', 'Enter the 6-digit code sent to your email')
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

          {successMessage && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {step === 'email' ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
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
                    {t('auth.otp.sending', 'Sending OTP...')}
                  </>
                ) : (
                  t('auth.otp.sendOTP', 'Send OTP')
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginWithOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('auth.fields.email', 'Email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">
                  {t('auth.otp.code', 'Verification code')}
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder={t('auth.otp.codePlaceholder', 'Enter 6-digit code')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 text-center tracking-widest"
                    required
                    autoComplete="one-time-code"
                  />
                </div>
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
                  {t('auth.login.rememberMe', 'Remember me')}
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!otp || otp.length !== 6 || isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {t('auth.otp.verifying', 'Verifying...')}
                  </>
                ) : (
                  t('auth.otp.verify', 'Verify & Sign in')
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-sm"
                >
                  {countdown > 0 
                    ? t('auth.otp.resendIn', `Resend in ${countdown}s`)
                    : t('auth.otp.resend', 'Resend OTP')
                  }
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {t('auth.otp.backToLogin', 'Want to use password instead?')}{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.otp.passwordLogin', 'Password login')}
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

export default OTPLoginForm;
