import type { ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useTranslation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm mx-auto">
          <CardContent className="p-6 text-center">
            <LoadingSpinner size={32} className="mb-3 mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSignedIn) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground mb-4">
              <Lock className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {t('auth.authRequired', 'Authentication Required')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('auth.signInRequired', 'Please sign in to access this feature.')}
            </p>
            <Button onClick={() => window.location.href = '/sign-in'}>
              {t('auth.signIn', 'Sign In')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
