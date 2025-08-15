import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function AuthHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <div className="flex items-center gap-2">
          <Link to="/join">
            <Button variant="default" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              {t('auth.signUp', 'Join Free')}
            </Button>
          </Link>
          
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              {t('auth.signIn', 'Sign In')}
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/settings'}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
              variables: {
                colorPrimary: "hsl(var(--primary))",
              }
            }}
            userProfileMode="modal"
            userProfileProps={{
              appearance: {
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-lg border border-border",
                },
                variables: {
                  colorPrimary: "hsl(var(--primary))",
                  colorBackground: "hsl(var(--background))",
                  colorInputBackground: "hsl(var(--background))",
                  colorInputText: "hsl(var(--foreground))",
                  colorText: "hsl(var(--foreground))",
                }
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
}
