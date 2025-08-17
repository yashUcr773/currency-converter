import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AuthHeader() {
  const { t } = useTranslation();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // If Clerk is not configured, show a setup message
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'your_clerk_publishable_key_here' || PUBLISHABLE_KEY === 'pk_test_your_actual_clerk_key_here') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs hidden lg:inline">Auth not configured</span>
          <span className="text-xs lg:hidden">No auth</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <div className="flex items-center gap-2">
          <span className="hidden xl:inline text-xs text-muted-foreground">
            Save to cloud:
          </span>
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
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center gap-1">
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
