import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, Shield, Zap, Globe, Briefcase, Plane, ShoppingCart, Users, Target, Star, Clock, Smartphone } from 'lucide-react';
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
      icon: <Target className="w-6 h-6" />,
      title: t('about.useCases.education'),
      description: t('about.useCases.educationDesc'),
      examples: t('about.useCases.educationExamples', { returnObjects: true }) as string[]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('about.useCases.quickMath'),
      description: t('about.useCases.quickMathDesc'),
      examples: t('about.useCases.quickMathExamples', { returnObjects: true }) as string[]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: t('about.features.fast'),
      description: t('about.features.fastDesc')
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      title: t('about.features.currencies'),
      description: t('about.features.currenciesDesc')
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: t('about.features.privacy'),
      description: t('about.features.privacyDesc')
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-500" />,
      title: t('about.features.offline'),
      description: t('about.features.offlineDesc')
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: t('about.features.fresh'),
      description: t('about.features.freshDesc')
    },
    {
      icon: <Star className="w-5 h-5 text-pink-500" />,
      title: t('about.features.rich'),
      description: t('about.features.richDesc')
    }
  ];

  const stats = [
    { number: "150+", label: t('about.stats.currenciesSupported') },
    { number: "5", label: t('about.stats.decimalPrecision') },
    { number: "24hrs", label: t('about.stats.cacheDuration') },
    { number: "100%", label: t('about.stats.privacyFocused') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LanguagePicker variant="compact" />
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('navigation.backToConverter')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
              {t('about.heroTitle')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t('about.description')}
            </p>
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

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('about.features.title')}</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('about.features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon}
                  <h4 className="font-semibold text-slate-800">{feature.title}</h4>
                </div>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Features */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('about.uniqueFeatures.title')}</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('about.uniqueFeatures.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t('about.uniqueFeatures.calculator')}
              </h4>
              <p className="text-slate-600 text-sm">{t('about.uniqueFeatures.calculatorDesc')}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                {t('about.uniqueFeatures.numberSystem')}
              </h4>
              <p className="text-slate-600 text-sm">{t('about.uniqueFeatures.numberSystemDesc')}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                {t('about.uniqueFeatures.installApp')}
              </h4>
              <p className="text-slate-600 text-sm">{t('about.uniqueFeatures.installAppDesc')}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                {t('about.uniqueFeatures.smartBase')}
              </h4>
              <p className="text-slate-600 text-sm">{t('about.uniqueFeatures.smartBaseDesc')}</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('about.useCases.title')}</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('about.useCases.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg text-blue-600">
                    {useCase.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800">{useCase.title}</h4>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer & Links */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('about.freeOpenSource')}</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              {t('about.freeDescription')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/yashUcr773/currency-converter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation group"
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
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation group"
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('navigation.startConverting')}
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>{t('about.footerText')}</p>
        </div>

      </main>
    </div>
  );
};