import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ExternalLink, 
  Shield, 
  Zap, 
  Globe, 
  Briefcase, 
  Plane, 
  ShoppingCart, 
  Users, 
  Target, 
  Clock, 
  Smartphone,
  Calculator,
  WifiOff,
  Languages,
  Palette,
  RefreshCw,
  Settings,
  Download,
  Coins,
  TrendingUp,
  MapPin,
  Accessibility
} from 'lucide-react';
import { DonateButton } from '@/components/DonateButton';
import { LanguagePicker } from '@/components/LanguagePicker';

export const AboutPage = () => {
  const { t } = useTranslation();

  const useCases = [
    {
      icon: <Plane className="w-6 h-6" />,
      title: t('about.useCases.travel'),
      description: t('about.useCases.travelDesc'),
      examples: t('about.useCases.travelExamples', { returnObjects: true }) as string[]
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: t('about.useCases.shopping'),
      description: t('about.useCases.shoppingDesc'),
      examples: t('about.useCases.shoppingExamples', { returnObjects: true }) as string[]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('about.useCases.finance'),
      description: t('about.useCases.financeDesc'),
      examples: t('about.useCases.financeExamples', { returnObjects: true }) as string[]
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: t('about.useCases.work'),
      description: t('about.useCases.workDesc'),
      examples: t('about.useCases.workExamples', { returnObjects: true }) as string[]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('about.useCases.timezone'),
      description: t('about.useCases.timezoneDesc'),
      examples: t('about.useCases.timezoneExamples', { returnObjects: true }) as string[]
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: t('about.useCases.quickMath'),
      description: t('about.useCases.quickMathDesc'),
      examples: t('about.useCases.quickMathExamples', { returnObjects: true }) as string[]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-warning" />,
      title: t('about.features.fast'),
      description: t('about.features.fastDesc')
    },
    {
      icon: <Coins className="w-5 h-5 text-info" />,
      title: t('about.features.currencies'),
      description: t('about.features.currenciesDesc')
    },
    {
      icon: <Calculator className="w-5 h-5 text-success" />,
      title: t('about.features.calculator'),
      description: t('about.features.calculatorDesc')
    },
    {
      icon: <MapPin className="w-5 h-5 text-destructive" />,
      title: t('about.features.timezone'),
      description: t('about.features.timezoneDesc')
    },
    {
      icon: <Languages className="w-5 h-5 text-primary" />,
      title: t('about.features.multilanguage'),
      description: t('about.features.multilanguageDesc')
    },
    {
      icon: <Smartphone className="w-5 h-5 text-info" />,
      title: t('about.features.pwa'),
      description: t('about.features.pwaDesc')
    },
    {
      icon: <WifiOff className="w-5 h-5 text-warning" />,
      title: t('about.features.offline'),
      description: t('about.features.offlineDesc')
    },
    {
      icon: <Shield className="w-5 h-5 text-success" />,
      title: t('about.features.privacy'),
      description: t('about.features.privacyDesc')
    },
    {
      icon: <Palette className="w-5 h-5 text-primary" />,
      title: t('about.features.design'),
      description: t('about.features.designDesc')
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-info" />,
      title: t('about.features.realtime'),
      description: t('about.features.realtimeDesc')
    },
    {
      icon: <Settings className="w-5 h-5 text-muted-foreground" />,
      title: t('about.features.customizable'),
      description: t('about.features.customizableDesc')
    },
    {
      icon: <Accessibility className="w-5 h-5 text-primary" />,
      title: t('about.features.accessible'),
      description: t('about.features.accessibleDesc')
    }
  ];

  const stats = [
    { number: "150+", label: t('about.stats.currenciesSupported') },
    { number: "10+", label: t('about.stats.languagesSupported') },
    { number: "24hrs", label: t('about.stats.cacheDuration') },
    { number: "100%", label: t('about.stats.privacyFocused') }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LanguagePicker variant="compact" />
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('navigation.backToConverter')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary">
              {t('about.title')}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('about.heroTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t('about.features.title')}</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon}
                  <h4 className="font-semibold text-foreground">{feature.title}</h4>
                </div>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Features */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t('about.uniqueFeatures.title')}</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.uniqueFeatures.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-info/10 rounded-2xl p-6 border border-info/20">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-info" />
                {t('about.uniqueFeatures.calculator')}
              </h4>
              <p className="text-muted-foreground text-sm">{t('about.uniqueFeatures.calculatorDesc')}</p>
            </div>
            
            <div className="bg-success/10 rounded-2xl p-6 border border-success/20">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-success" />
                {t('about.uniqueFeatures.numberSystem')}
              </h4>
              <p className="text-muted-foreground text-sm">{t('about.uniqueFeatures.numberSystemDesc')}</p>
            </div>
            
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                {t('about.uniqueFeatures.installApp')}
              </h4>
              <p className="text-muted-foreground text-sm">{t('about.uniqueFeatures.installAppDesc')}</p>
            </div>
            
            <div className="bg-warning/10 rounded-2xl p-6 border border-warning/20">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-warning" />
                {t('about.uniqueFeatures.smartBase')}
              </h4>
              <p className="text-muted-foreground text-sm">{t('about.uniqueFeatures.smartBaseDesc')}</p>
            </div>

            <div className="bg-info/10 rounded-2xl p-6 border border-info/20">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-info" />
                {t('about.uniqueFeatures.timezone')}
              </h4>
              <p className="text-muted-foreground text-sm">{t('about.uniqueFeatures.timezoneDesc')}</p>
            </div>

            <div className="bg-success/10 rounded-2xl p-6 border border-success/20">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-success" />
                {t('about.uniqueFeatures.updates')}
              </h4>
              <p className="text-muted-foreground text-sm">{t('about.uniqueFeatures.updatesDesc')}</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t('about.useCases.title')}</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.useCases.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    {useCase.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">{useCase.title}</h4>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer & Links */}
        <div className="bg-primary/10 rounded-3xl p-8 border border-primary/20">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">{t('about.freeOpenSource')}</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('about.freeDescription')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/yashUcr773/currency-converter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation group"
                title="View source code on GitHub"
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>{t('about.links.viewGithub')}</span>
              </a>
              
              <a
                href="https://exchangerate-api.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-info hover:bg-info/90 text-info-foreground font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation group"
                title={t('about.links.poweredBy')}
              >
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>{t('about.links.exchangeRateApi')}</span>
              </a>
              
              <DonateButton />
            </div>
          </div>
        </div>

        {/* Back to App CTA */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('navigation.startConverting')}
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm space-y-2">
          <p>{t('about.footerText')}</p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/privacy" 
              className="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
            >
              <Shield className="w-4 h-4" />
              {t('privacy.title')}
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
};