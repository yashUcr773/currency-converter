import { useUser, useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from './ProtectedRoute';

export function UserSettings() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">{t('auth.account', 'Account Settings')}</h1>
            <p className="text-muted-foreground">{t('auth.welcome', 'Welcome back!')}</p>
          </div>

          {user && (
            <>
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-2 border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.fullName || 'Anonymous User'}
                      </h3>
                      <p className="text-muted-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span>{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{new Date(user.createdAt!).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="secondary" className="text-xs">
                        {user.primaryEmailAddress?.verification?.status === 'verified' ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Your currency preferences, timezone settings, and other app data are saved locally on your device.
                    Authentication helps us provide a consistent experience across your devices in future updates.
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/user-profile'}
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    {t('auth.signOut', 'Sign Out')}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
