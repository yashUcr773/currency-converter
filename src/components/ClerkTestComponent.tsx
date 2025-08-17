import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export function ClerkTestComponent() {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  return (
    <div className="p-4 border border-red-500 bg-red-50 rounded">
      <h3 className="font-bold mb-2">Clerk Debug Info</h3>
      <p className="text-sm mb-2">
        Publishable Key: {PUBLISHABLE_KEY ? 'Set' : 'Not Set'}
      </p>
      <p className="text-sm mb-2">
        Key Value: {PUBLISHABLE_KEY || 'undefined'}
      </p>
      
      <div className="mt-4">
        <SignedOut>
          <div className="space-y-2">
            <p className="text-sm">You are signed out. Buttons should appear below:</p>
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="space-y-2">
            <p className="text-sm">You are signed in!</p>
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
