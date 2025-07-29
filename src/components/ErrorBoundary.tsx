import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/utils/env';
import { clearCacheAndReload } from '@/utils/clearCacheAndReload';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    logger.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: sendToErrorReporting(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    // Use a hook in a class component via a wrapper
    const TranslatedFallback = () => {
      const { t } = useTranslation();
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('errorBoundary.somethingWentWrong')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('errorBoundary.unexpectedHappened')}
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => clearCacheAndReload()}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('errorBoundary.tryAgain')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => clearCacheAndReload()}
                  className="w-full"
                >
                  {t('errorBoundary.refreshPage')}
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    {t('errorBoundary.errorDetails')}
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default fallback UI with translations
      return <TranslatedFallback />;
    }

    return this.props.children;
  }
}
