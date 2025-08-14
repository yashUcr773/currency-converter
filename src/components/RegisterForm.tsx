import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from './LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface PasswordStrength {
  score: number;
  feedback: string[];
}

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [] });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
    
    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...credentials } = formData;
      await register(credentials);
      navigate('/verify-email-notice');
    } catch (error) {
      // Error is handled by the context
      console.error('Registration failed:', error);
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
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordStrength.score >= 2;

  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

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
            {t('auth.register.title', 'Create account')}
          </CardTitle>
          <CardDescription>
            {t('auth.register.subtitle', 'Enter your details to get started')}
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
                {t('auth.fields.email', 'Email')}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {t('auth.fields.password', 'Password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.fields.passwordPlaceholder', 'Enter your password')}
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
                {t('auth.fields.confirmPassword', 'Confirm password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('auth.fields.confirmPasswordPlaceholder', 'Confirm your password')}
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
                  {t('auth.register.creating', 'Creating account...')}
                </>
              ) : (
                t('auth.register.createAccount', 'Create account')
              )}
            </Button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('auth.or', 'Or')}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/register/magic-link')}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                {t('auth.register.withMagicLink', 'Sign up with Magic Link')}
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            {t('auth.register.hasAccount', 'Already have an account?')}{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.register.signIn', 'Sign in')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
