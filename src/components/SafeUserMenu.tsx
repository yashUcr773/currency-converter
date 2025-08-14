import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';

// Error boundary for auth-related errors
class AuthErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Auth component error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Fallback component
const AuthFallback: React.FC = () => (
  <div className="flex items-center space-x-2">
    <Link to="/login">
      <Button variant="ghost" size="sm" className="text-sm">
        <LogIn className="w-4 h-4 mr-1" />
        Sign In
      </Button>
    </Link>
    <Link to="/register">
      <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
        <User className="w-4 h-4 mr-1" />
        Sign Up
      </Button>
    </Link>
  </div>
);

// Lazy load the UserMenu to isolate any context errors
const LazyUserMenu = React.lazy(() => 
  import('./UserMenu').catch(() => ({ 
    default: AuthFallback 
  }))
);

// Safe wrapper for UserMenu
const SafeUserMenu: React.FC = () => {
  return (
    <AuthErrorBoundary fallback={<AuthFallback />}>
      <React.Suspense fallback={<AuthFallback />}>
        <LazyUserMenu />
      </React.Suspense>
    </AuthErrorBoundary>
  );
};

export default SafeUserMenu;
