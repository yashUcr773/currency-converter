import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Shield, Zap, Globe, Heart, TrendingUp, Briefcase, Plane, ShoppingCart, Users, Target, Code, Star, Award, Clock, Smartphone } from 'lucide-react';
import { FeatureRequestSection } from '../components/FeatureRequestSection';

export const AboutPage = () => {
  const useCases = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Business & Finance",
      description: "Calculate international invoices, track foreign investments, and manage multi-currency budgets with precision.",
      examples: ["Invoice calculations", "Investment tracking", "Budget planning", "Cost analysis"]
    },
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Travel & Tourism",
      description: "Plan trips, compare costs across countries, and budget for international travel with real-time rates.",
      examples: ["Trip budgeting", "Hotel comparisons", "Activity costs", "Emergency funds"]
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Online Shopping",
      description: "Compare prices from international stores, calculate shipping costs, and find the best deals worldwide.",
      examples: ["Price comparisons", "Shipping calculations", "Deal hunting", "Market research"]
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Trading & Investment",
      description: "Monitor forex markets, calculate portfolio values, and make informed currency trading decisions.",
      examples: ["Forex analysis", "Portfolio valuation", "Trading decisions", "Risk assessment"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personal Finance",
      description: "Send money abroad, calculate remittances, and manage international financial obligations.",
      examples: ["Money transfers", "Family support", "International bills", "Savings planning"]
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Education & Research",
      description: "Study economics, research global markets, and understand international financial systems.",
      examples: ["Academic projects", "Market analysis", "Economic studies", "Financial literacy"]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Instant conversions with optimized performance"
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      title: "170+ Currencies",
      description: "Complete coverage of world currencies"
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: "Privacy First",
      description: "No tracking, no ads, your data stays local"
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-500" />,
      title: "Mobile Ready",
      description: "Perfect experience on any device"
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: "Real-time Rates",
      description: "Always up-to-date exchange rates"
    },
    {
      icon: <Star className="w-5 h-5 text-pink-500" />,
      title: "Offline Support",
      description: "Works without internet connection"
    }
  ];

  const whyDeveloped = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Simplicity First",
      content: "Most currency converters are cluttered with ads, complex interfaces, and unnecessary features. We built a clean, focused tool that does one thing exceptionally well."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Privacy Matters",
      content: "In an age of data harvesting, we created a converter that respects your privacy. No tracking, no data collection, no intrusive ads - just pure functionality."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Speed & Reliability",
      content: "Financial decisions require accurate, fast information. Our app provides instant conversions with 5-decimal precision and works offline when you need it most."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "User Experience",
      content: "We designed every interaction to be intuitive and delightful. From the smooth animations to the responsive design, every detail serves the user."
    }
  ];

  const stats = [
    { number: "170+", label: "Currencies Supported" },
    { number: "5", label: "Decimal Precision" },
    { number: "24/7", label: "Rate Updates" },
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
              Fast, accurate, and privacy-focused currency conversion for everyone. 
              From business professionals to casual travelers, we've got your currency needs covered.
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
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Our Converter?</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built with modern technology and user experience in mind
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

        {/* Use Cases */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Perfect For Every Need</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From personal finance to business operations, our converter adapts to your requirements
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

        {/* Why Developed */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Why We Built This</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              The story behind creating a better currency converter for the modern world
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {whyDeveloped.map((reason, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
                    {reason.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-3">{reason.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{reason.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Requests */}
        <FeatureRequestSection />

        {/* Technical Details */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Built with Modern Technology</h3>
            <p className="text-lg text-slate-600">
              Powered by cutting-edge web technologies for optimal performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/60 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Code className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-slate-800">Frontend</h4>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• React 18 with TypeScript</div>
                <div>• Tailwind CSS for styling</div>
                <div>• Vite for fast development</div>
                <div>• PWA capabilities</div>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-slate-800">Data Source</h4>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• ExchangeRate-API</div>
                <div>• Real-time updates</div>
                <div>• 170+ currencies</div>
                <div>• 5-decimal precision</div>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-slate-800">Privacy & Security</h4>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• No data collection</div>
                <div>• Local storage only</div>
                <div>• No tracking scripts</div>
                <div>• Open source</div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer & Links */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Open Source & Community</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Built with ❤️ by developers, for developers and users worldwide. 
              Join our community and contribute to making currency conversion better for everyone.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/yashUcr773/currency-converter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
              
              <a
                href="https://exchangerate-api.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                ExchangeRate-API
              </a>
              
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium">
                <Award className="w-4 h-4" />
                Version 2.0
              </div>
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
          <p>Made with ❤️ for the global community • Privacy-first • Open Source</p>
        </div>

      </main>
    </div>
  );
};
