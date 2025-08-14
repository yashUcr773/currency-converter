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
import { Mail, User, Zap, AlertCircle, CheckCircle } from 'lucide-react';

const MagicLinkSignupForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signupWithMagicLink, loading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName || !formData.lastName) return;

    setIsSubmitting(true);
    clearError();

    try {
      await signupWithMagicLink(formData.email, formData.firstName, formData.lastName);
      setIsLinkSent(true);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      // Error is handled by the context
      console.error('Magic link signup request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendLink = async () => {
    if (countdown > 0) return;

    clearError();

    try {
      await signupWithMagicLink(formData.email, formData.firstName, formData.lastName);
      setCountdown(60);
    } catch (error) {
      console.error('Resend magic link failed:', error);
    }
  };

  const handleBack = () => {
    setIsLinkSent(false);
    clearError();
  };

  const isFormValid = formData.email && formData.firstName && formData.lastName;

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
            {isLinkSent 
              ? t('auth.magicLinkSignup.sentTitle', 'Check your email')
              : t('auth.magicLinkSignup.title', 'Sign up with Magic Link')
            }
          </CardTitle>
          <CardDescription>
            {isLinkSent 
              ? t('auth.magicLinkSignup.sentSubtitle', 'We\'ve sent you a magic signup link')
              : t('auth.magicLinkSignup.subtitle', 'No password needed - just enter your details')
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
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t('auth.fields.firstName', 'First name')}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder={t('auth.fields.firstNamePlaceholder', 'John')}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {t('auth.fields.lastName', 'Last name')}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder={t('auth.fields.lastNamePlaceholder', 'Doe')}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('auth.magicLinkSignup.helpText', 'We\'ll send you a secure link to complete your registration')}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || isSubmitting || loading}
              >
                {isSubmitting || loading ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {t('auth.magicLinkSignup.sending', 'Sending magic link...')}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {t('auth.magicLinkSignup.sendLink', 'Send Magic Link')}
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
                  {t('auth.magicLinkSignup.checkInbox', 'Check your inbox')}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('auth.magicLinkSignup.emailSent', 'We\'ve sent a magic signup link to:')}
                </p>
                <div className="bg-white/50 border border-muted rounded-lg px-3 py-2 font-medium text-sm">
                  {formData.email}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {t('auth.magicLinkSignup.linkExpiry', 'This link will expire in 15 minutes for security.')}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  size="sm"
                >
                  {t('auth.magicLinkSignup.backToForm', 'Back to form')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleResendLink}
                  disabled={countdown > 0}
                  size="sm"
                >
                  {countdown > 0 
                    ? t('auth.magicLinkSignup.resendTimer', `Resend in ${countdown}s`)
                    : t('auth.magicLinkSignup.resend', 'Resend link')
                  }
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {t('auth.magicLinkSignup.hasAccount', 'Already have an account?')}{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.magicLinkSignup.signIn', 'Sign in')}
            </Link>
          </div>
          
          <div className="text-sm text-center">
            {t('auth.magicLinkSignup.preferPassword', 'Prefer a password?')}{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.magicLinkSignup.regularSignup', 'Regular signup')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MagicLinkSignupForm;
