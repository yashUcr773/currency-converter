import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Check, Smartphone, Cloud, Shield, Zap, Star, Users, Globe, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function JoinPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Keep your preferences synced across all devices automatically'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your personalized data from anywhere, anytime'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and always protected with enterprise-grade security'
    },
    {
      icon: Zap,
      title: 'Enhanced Features',
      description: 'Unlock premium tools, custom alerts, and advanced personalization'
    },
    {
      icon: Star,
      title: 'Favorite Currencies',
      description: 'Save your most-used currencies for quick access and faster conversions'
    },
    {
      icon: Users,
      title: 'Community Features',
      description: 'Share conversion sets, get insights, and connect with other users'
    }
  ];

  const benefits = [
    'Free forever with no credit card required',
    'No spam - we respect your inbox',
    'Cancel anytime with one click',
    'GDPR compliant and privacy-focused',
    'Enterprise-grade security standards',
    '24/7 customer support'
  ];

  const stats = [
    { number: '50,000+', label: 'Active Users' },
    { number: '150+', label: 'Currencies' },
    { number: '10+', label: 'Languages' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <SignedOut>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trip Tools
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="outline">
                  {t('auth.signIn', 'Sign In')}
                </Button>
              </SignInButton>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
                Join Trip Tools Today
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Create your free account to unlock personalized features, save your preferences, and access your data from anywhere in the world.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                  <Check className="w-5 h-5 mr-2" />
                  Start Free - No Credit Card Required
                </Button>
              </SignUpButton>
              
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Already have an account? Sign In
                </Button>
              </SignInButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Create an Account?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Unlock powerful features and personalize your Trip Tools experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800">{feature.title}</h4>
                  </div>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">What You Get</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to enhance your Trip Tools experience
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Lock className="w-12 h-12 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Your Privacy Matters</h3>
                  <p className="text-slate-600">We take security and privacy seriously</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-600">Your data is encrypted at rest and in transit</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                  <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800">GDPR Compliant</h4>
                  <p className="text-sm text-slate-600">Full compliance with international privacy laws</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800">No Data Selling</h4>
                  <p className="text-sm text-slate-600">We never sell your personal information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-800">Ready to Get Started?</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Join thousands of users who trust Trip Tools for their conversion needs
              </p>
            </div>
            
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-4">
                <Check className="w-5 h-5 mr-2" />
                Create Your Free Account Now
              </Button>
            </SignUpButton>
            
            <p className="text-sm text-slate-600">
              Takes less than 30 seconds • No credit card required
            </p>
          </div>
        </div>
      </div>
    </SignedOut>
  );
}
