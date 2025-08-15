import { SignIn } from '@clerk/clerk-react';

export function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn 
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
          path="/sign-in" 
          signUpUrl="/sign-up" 
        />
      </div>
    </div>
  );
}
