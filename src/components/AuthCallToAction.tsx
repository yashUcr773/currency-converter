import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Smartphone, Cloud, Shield, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AuthCallToAction() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Keep your preferences synced across all devices'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your data from anywhere, anytime'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and always protected'
    },
    {
      icon: Zap,
      title: 'Enhanced Features',
      description: 'Unlock premium tools and personalization'
    }
  ];

  return (
    <SignedOut>
      <div className="my-8">
        <Card className="border-0 shadow-xl bg-primary/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary">
              {t('auth.welcomeTitle', 'Create Your Free Account')}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {t('auth.welcomeSubtitle', 'Join thousands of users who trust us with their conversions')}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <SignUpButton mode="modal">
                <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Check className="w-4 h-4 mr-2" />
                  {t('auth.signUp', 'Start Free - No Credit Card Required')}
                </Button>
              </SignUpButton>
              
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="flex-1">
                  {t('auth.signIn', 'Already have an account? Sign In')}
                </Button>
              </SignInButton>
            </div>

            {/* Trust indicators */}
            <div className="text-center pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                ✓ Free forever &nbsp;&nbsp; ✓ No spam ever &nbsp;&nbsp; ✓ Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SignedOut>
  );
}
