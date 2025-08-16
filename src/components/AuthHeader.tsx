import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Settings, LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function AuthHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <div className="flex items-center gap-1">
          <SignUpButton mode="modal">
            <Button variant="default" size="sm" className="gap-1 px-2 py-1 h-auto text-xs">
              <UserPlus className="w-3 h-3" />
              <span className="hidden lg:inline">{t('auth.signUp', 'Sign Up')}</span>
              <span className="lg:hidden">Join</span>
            </Button>
          </SignUpButton>
          
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="gap-1 px-2 py-1 h-auto text-xs">
              <LogIn className="w-3 h-3" />
              <span className="hidden lg:inline">{t('auth.signIn', 'Sign In')}</span>
              <span className="lg:hidden">In</span>
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center gap-1">
          <Link to="/settings">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 px-2 py-1 h-auto text-xs"
            >
              <Settings className="w-3 h-3" />
              <span className="hidden lg:inline">Settings</span>
            </Button>
          </Link>
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-6 h-6",
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
