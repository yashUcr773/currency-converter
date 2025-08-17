import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { logger } from '@/utils/env';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkWrapperProps {
  children: React.ReactNode;
}

export function ClerkWrapper({ children }: ClerkWrapperProps) {
  // If no Clerk key is provided, render children without Clerk provider
  // This allows the app to work without authentication features
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'your_clerk_publishable_key_here') {
    logger.warn('Clerk publishable key not configured. Authentication features will be disabled.');
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
