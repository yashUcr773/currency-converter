import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Zap, Globe, Briefcase, Plane, ShoppingCart, Users, Target, Star, Clock, Smartphone } from 'lucide-react';
import { DonateButton } from '@/components/DonateButton';

export const AboutPage = () => {
  const useCases = [
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Travel Planning",
      description: "Convert currencies for trip budgeting and expense planning. Check how much your money is worth in different countries.",
      examples: ["See what $500 equals in euros", "Convert hotel price to your currency", "Check how much 1000 yen is worth", "Convert any amount between currencies"]
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Online Shopping",
      description: "Convert prices from international websites to your local currency. Compare costs across different countries.",
      examples: ["Convert ¥15,000 to your currency", "See what £50 costs in dollars", "Convert any foreign price", "Check currency exchange rates"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personal Finance",
      description: "Convert currencies for personal money management, remittances, and international transactions.",
      examples: ["Convert salary amounts", "Check exchange rates for transfers", "See foreign account values", "Convert any money amounts"]
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Remote Work",
      description: "Convert client payments and project rates when working with international clients.",
      examples: ["Convert $50/hour rate", "See payment in local currency", "Check project values", "Convert invoice amounts"]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Education & Research",
      description: "Study currency values, understand exchange rates, and learn about global economics with real data.",
      examples: ["Check current exchange rates", "Study currency trends", "Research global currencies", "Learn about money values worldwide"]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Math & Convert",
      description: "Use the built-in calculator for math, then convert the result to any currency.",
      examples: ["Calculate tip amount, then convert", "Do math, apply result to currency", "Split amounts and convert", "Quick calculations with currency"]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Fast",
      description: "Instant conversions with quick loading"
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      title: "150+ Currencies",
      description: "Comprehensive global currency support"
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: "Privacy First",
      description: "No tracking, no ads, your data stays private"
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-500" />,
      title: "Works Offline",
      description: "Install as app, works without internet"
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: "Always Fresh",
      description: "Updates exchange rates automatically"
    },
    {
      icon: <Star className="w-5 h-5 text-pink-500" />,
      title: "Rich Features",
      description: "Calculator, number systems, pin favorites"
    }
  ];

  const stats = [
    { number: "150+", label: "Currencies Supported" },
    { number: "5", label: "Decimal Precision" },
    { number: "24hrs", label: "Cache Duration" },
    { number: "100%", label: "Privacy Focused" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Converter</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Currency Converter
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
              The Currency Converter<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                You Actually Want to Use
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A simple currency converter with offline support, built-in calculator, 
              and multiple number formats. Quick, reliable, and private.
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
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Key Features</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple features for everyday currency conversion
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
            <h3 className="text-3xl font-bold text-slate-800 mb-4">What Makes It Special</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Features that set this currency converter apart
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Built-in Calculator
              </h4>
              <p className="text-slate-600 text-sm">Mini calculator that integrates with currency conversions. Perform calculations and directly use results in currency fields.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Number System Toggle
              </h4>
              <p className="text-slate-600 text-sm">Switch between International (1,000,000) and Indian (10,00,000) number formatting systems with persistent preference storage.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                Install as App
              </h4>
              <p className="text-slate-600 text-sm">Add to your device's home screen and use like a native app. Works even when you're offline.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                Smart Base Currency
              </h4>
              <p className="text-slate-600 text-sm">Tap any exchange rate to set it as the base currency. Dynamic conversion rates update automatically across all pinned currencies.</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Common Use Cases</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple currency conversion for everyday scenarios
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
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Free & Open Source</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Free to use currency converter with no ads or tracking. 
              Source code is available for anyone to review, modify, or learn from.
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
                <span>View on GitHub</span>
              </a>
              
              <a
                href="https://exchangerate-api.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation group"
                title="Powered by ExchangeRate-API"
              >
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>ExchangeRate-API</span>
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
            Start Converting Currencies
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>Free currency converter • Open source • No tracking</p>
        </div>

      </main>
    </div>
  );
};
