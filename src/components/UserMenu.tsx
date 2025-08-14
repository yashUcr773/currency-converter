import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Mail, 
  ChevronDown,
  AlertCircle,
  Crown
} from 'lucide-react';

const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            {t('auth.login.signIn', 'Sign in')}
          </Button>
        </Link>
        <Link to="/register">
          <Button size="sm">
            {t('auth.register.signUp', 'Sign up')}
          </Button>
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      await logout(true); // Logout from all devices
      navigate('/');
    } catch (error) {
      console.error('Logout all failed:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium">
              {getInitials(user.firstName, user.lastName)}
            </span>
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {user.firstName}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {getInitials(user.firstName, user.lastName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                {user.accountType === 'premium' && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Email Verification Alert */}
          {!user.isEmailVerified && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {t('auth.user.emailNotVerified', 'Email not verified')}{' '}
                <Link 
                  to="/verify-email-notice" 
                  className="underline font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t('auth.user.verifyNow', 'Verify now')}
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Menu Items */}
          <div className="space-y-1">
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <User className="mr-3 h-4 w-4" />
                {t('auth.user.profile', 'Profile')}
              </Button>
            </Link>
            
            <Link to="/settings" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Settings className="mr-3 h-4 w-4" />
                {t('auth.user.settings', 'Settings')}
              </Button>
            </Link>

            <Link to="/security" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Shield className="mr-3 h-4 w-4" />
                {t('auth.user.security', 'Security')}
              </Button>
            </Link>

            {!user.isEmailVerified && (
              <Link to="/verify-email-notice" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm text-orange-600">
                  <Mail className="mr-3 h-4 w-4" />
                  {t('auth.user.verifyEmail', 'Verify Email')}
                </Button>
              </Link>
            )}
          </div>

          <Separator />

          {/* Logout Options */}
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              {t('auth.user.signOut', 'Sign out')}
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm text-muted-foreground"
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              {t('auth.user.signOutAll', 'Sign out all devices')}
            </Button>
          </div>

          {/* Account Info */}
          <Separator />
          <div className="text-xs text-muted-foreground">
            <p>
              {t('auth.user.memberSince', 'Member since')}{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            {user.lastLogin && (
              <p>
                {t('auth.user.lastLogin', 'Last login')}{' '}
                {new Date(user.lastLogin).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
