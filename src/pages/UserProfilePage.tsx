import { UserProfile } from '@clerk/clerk-react';

export function UserProfilePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <UserProfile 
          appearance={{
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
          }}
          routing="path" 
          path="/user-profile" 
        />
      </div>
    </div>
  );
}
