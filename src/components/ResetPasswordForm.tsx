import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PasswordStrength {
  score: number;
  feedback: string[];
}

const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] });
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check if token exists
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setIsTokenValid(false);
    }
  }, [searchParams]);

  // Calculate password strength
  const calculatePasswordStrength = useCallback((password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push(t('auth.password.minLength', 'At least 8 characters'));
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('auth.password.mixedCase', 'Mix of upper and lowercase'));
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('auth.password.numbers', 'Include numbers'));
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push(t('auth.password.symbols', 'Include special characters'));
    }

    return { score, feedback };
  }, [t]);

  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [formData.password, calculatePasswordStrength]);

  const getStrengthColor = (score: number) => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-yellow-500';
    if (score >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = (score: number) => {
    if (score >= 4) return t('auth.password.strong', 'Strong');
    if (score >= 3) return t('auth.password.good', 'Good');
    if (score >= 2) return t('auth.password.fair', 'Fair');
    return t('auth.password.weak', 'Weak');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = searchParams.get('token');
    if (!token || !isFormValid) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await resetPassword(token, formData.password);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Error is handled by the context
      console.error('Password reset failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = 
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordStrength.score >= 2;

  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t('auth.resetPassword.invalidTitle', 'Invalid reset link')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.resetPassword.invalidSubtitle', 'This password reset link is invalid or expired')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.resetPassword.linkExpired', 'This password reset link is invalid, expired, or has already been used.')}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Link to="/forgot-password">
                  <Button className="w-full">
                    {t('auth.resetPassword.requestNew', 'Request new reset link')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    {t('auth.resetPassword.backToLogin', 'Back to login')}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t('auth.resetPassword.successTitle', 'Password reset successful!')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.resetPassword.successSubtitle', 'Your password has been successfully reset')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('auth.resetPassword.successMessage', 'You can now sign in with your new password. You will be redirected to the login page shortly.')}
                </AlertDescription>
              </Alert>
              <LoadingSpinner size={20} className="mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {t('auth.resetPassword.title', 'Reset your password')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.resetPassword.subtitle', 'Enter your new password below')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">
                {t('auth.fields.newPassword', 'New password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.fields.passwordPlaceholder', 'Enter your new password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>

                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {passwordStrength.feedback.map((item, index) => (
                        <div key={index}>• {item}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('auth.fields.confirmPassword', 'Confirm new password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('auth.fields.confirmPasswordPlaceholder', 'Confirm your new password')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${!passwordsMatch ? 'border-destructive' : ''}`}
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                {formData.confirmPassword && passwordsMatch && (
                  <CheckCircle className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                )}
              </div>
              
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">
                  {t('auth.register.passwordMismatch', 'Passwords do not match')}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  {t('auth.resetPassword.resetting', 'Resetting password...')}
                </>
              ) : (
                t('auth.resetPassword.resetButton', 'Reset password')
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {t('auth.resetPassword.rememberPassword', 'Remember your password?')}{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.resetPassword.signIn', 'Sign in')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
