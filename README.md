# RateVault

**Currency and Timezone Conversion — in One Vault**

> 📋 **Note**: This README consolidates all project documentation. All individual `.md` files have been merged into this comprehensive guide.
<!-- CSP completely disabled -->

# Trip Tools

Every Tool You Need for Every Trip. A comprehensive PWA suite featuring currency conversion, timezone management, unit conversion, travel calculators, and itinerary planning that works completely offline.

## ✨ Features

### 💱 **Advanced Currency Conversion**
- **Real-time conversion** with 5-decimal precision for accurate calculations
- **150+ currencies** including major global, regional, and cryptocurrency support
- **Two-way sync**: Update any currency field and all others automatically adjust
- **Pin/unpin currencies** for personalized workspace with persistent storage
- **Smart base currency**: Tap any rate to set it as the new base currency
- **Custom exchange rates** for "what-if" scenarios with visual indicators
- **Automatic rate fetching** from ExchangeRate-API with 24-hour caching

### 🌍 **Comprehensive Timezone Support**
- **World timezone converter** with major cities and UTC offsets
- **Real-time world clock** showing current time across multiple zones
- **Timezone cards** for quick reference of different regions
- **DST (Daylight Saving Time)** automatic handling
- **Cross-timezone conversion** for scheduling and planning

### 🧮 **Built-in Calculator & Tools**
- **Mini calculator** with full arithmetic operations
- **Tip calculator** with preset and custom percentages
- **Apply results directly** to currency conversions
- **Multi-currency calculations** for complex scenarios
- **Number system toggle** between International (1,000,000) and Indian (10,00,000) formats

### 🌐 **Multi-language Support**
- **10+ languages** including English, Spanish, French, German, Portuguese, Russian, Chinese, Japanese, Hindi, and Arabic
- **RTL language support** for Arabic with proper layout adjustments
- **Dynamic language switching** with instant UI updates
- **Culturally appropriate** number formatting and translations

### 📱 **Progressive Web App (PWA)**
- **Install as native app** on mobile and desktop devices
- **Offline-first architecture** - works completely without internet
- **Service worker caching** for instant loading and reliability
- **Background updates** with user-friendly update notifications
- **Hard refresh capability** to ensure latest version loads properly
- **Local data persistence** with intelligent cache management

### 🎨 **Modern User Experience**
- **Responsive design** optimized for mobile, tablet, and desktop
- **Dark mode ready** with system preference detection
- **Intuitive touch controls** with proper mobile interactions
- **Loading states** and error boundaries for graceful failure handling
- **Visual status indicators** for online/offline, updates, and custom rates
- **Accessibility features** with proper ARIA labels and keyboard navigation

### ⚡ **Advanced Features**
- **Refresh warning modal** educating users about PWA caching behavior
- **Update prompt system** with clear explanation of what happens during updates
- **Error boundary protection** preventing complete app crashes
- **Debug capabilities** for development and troubleshooting
- **SEO optimization** with proper meta tags and structured data
- **Performance monitoring** with render counting and optimization

### 🔒 **Privacy & Security**
- **No tracking or analytics** - completely privacy-focused
- **Local data storage** - all preferences stored on your device
- **No account required** - instant usage without registration
- **Open source** - fully transparent and auditable code
- **HTTPS enforced** for secure API communications

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.1.0** - Latest React version with concurrent features
- **TypeScript** - Full type safety and enhanced developer experience
- **Vite 7.0.4** - Lightning-fast build tooling and dev server

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Modern icon library
- **CSS Grid & Flexbox** - Responsive layout systems

### PWA & Performance
- **Service Workers** - Background sync, caching, and update management
- **Web App Manifest** - Native app-like installation
- **LocalStorage API** - Efficient client-side data persistence
- **Background Sync** - Automatic data updates when online

### Internationalization
- **react-i18next 15.1.4** - Comprehensive i18n framework
- **10+ Language Support** - Complete UI translation
- **RTL Language Support** - Arabic and Hebrew text direction
- **Dynamic Language Switching** - Real-time locale changes

### State Management & Hooks
- **React Context API** - Global state management
- **Custom Hooks** - Reusable logic for currency, time, PWA features
- **useReducer & useState** - Local component state management
- **useEffect & useMemo** - Performance optimization

### API & Data
- **ExchangeRate-API** - Real-time currency exchange rates
- **Fetch API** - Modern HTTP client with error handling
- **Data caching** - Intelligent storage with expiry management
- **Offline fallback** - Graceful degradation without internet

## 📱 PWA Features

### Installation
- **Add to Home Screen** - Native app-like icon on device
- **Standalone Mode** - Runs without browser UI
- **Cross-platform** - Works on iOS, Android, Windows, macOS, Linux

### Performance
- **Instant Loading** - Service worker caching for sub-second load times
- **Offline Functionality** - Complete app functionality without internet
- **Background Updates** - Automatic data refresh when online
- **Minimal Data Usage** - Efficient caching reduces bandwidth

### Native Integration
- **Push Notifications** (ready for implementation)
- **Share API** - Share conversion results with other apps
- **Install Prompts** - Smart installation suggestions
- **Update Management** - Seamless version updates with user control

## 🔄 Development

### Quick Start
```bash
# Clone and install
git clone <repository-url>
cd currency-converter
npm install

# Development server
npm run dev              # Start dev server (http://localhost:5173)

# Building
npm run build           # Production build
npm run preview         # Preview production build
npm run deploy          # Deploy to Vercel

# Code Quality
npm run lint            # ESLint checking
npm run type-check      # TypeScript verification
```

### Project Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (Radix)
│   ├── CurrencyInput.tsx
│   ├── StatusBar.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useCurrencyConverter.ts
│   ├── usePWA.ts
│   └── ...
├── contexts/           # React Context providers
├── i18n/              # Internationalization
│   ├── config.ts
│   └── locales/       # Translation files
├── utils/             # Utility functions
├── constants.ts       # App configuration
└── types.ts          # TypeScript definitions
```

### Environment Variables
```bash
# .env (optional)
VITE_API_BASE_URL=https://api.exchangerate-api.com/v4/latest
VITE_APP_VERSION=1.0.0
```

### Performance Optimizations
- **Code Splitting** - Dynamic imports for faster initial load
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Compressed images and fonts
- **Caching Strategy** - Smart cache invalidation
- **Bundle Analysis** - Webpack bundle analyzer integration

## 🧪 Testing & Quality

### 🔍 **Manual Testing Guide**

#### Basic Functionality Testing
1. **Currency Input Testing**
   - Open RateVault and verify 3 default currencies (USD, EUR, GBP) are displayed
   - Test real-time conversion by changing values in any currency field
   - Verify decimal values work correctly (e.g., 123.45)
   - Test empty field behavior (should remain empty, not show 0)
   - Test cross-conversion between all currencies

2. **Calculator Integration**
   - Click the "Calc" button in the status bar
   - Perform basic arithmetic operations (+, -, ×, ÷)
   - Use "Apply Result" to transfer calculations to currency fields
   - Test error handling for division by zero

3. **PWA Features**
   - Test offline functionality by disconnecting internet
   - Verify PWA installation prompts appear
   - Test service worker caching and background sync
   - Verify app works in standalone mode after installation

4. **Multi-language Support**
   - Switch between all 10+ supported languages
   - Verify UI elements translate correctly
   - Test RTL layout for Arabic language
   - Confirm number formatting changes appropriately

5. **Timezone Conversion**
   - Test timezone picker functionality
   - Verify real-time clock updates
   - Test timezone conversion calculations
   - Confirm DST handling is accurate

#### Edge Cases & Error Handling
- **Large Numbers**: Test with very large currency amounts
- **Small Decimals**: Test precision with small decimal values (0.01)
- **Network Errors**: Test behavior when API is unavailable
- **Browser Compatibility**: Test across Chrome, Firefox, Safari, Edge
- **Mobile Responsiveness**: Test on various screen sizes and orientations

### Code Quality Tools
- **ESLint** - Code linting with recommended rules
- **TypeScript** - Compile-time error checking
- **Prettier** - Code formatting (configured)
- **Husky** - Git hooks for quality gates

### Browser Support
- **Modern Browsers** - Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **PWA Support** - All major browsers with service worker support
- **Mobile Browsers** - iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement** - Graceful fallbacks for older browsers

### Performance Metrics
- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Time to Interactive** - < 3.5s
- **Lighthouse Score** - 95+ across all categories

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
```

### Other Platforms
- **Netlify**: Drag & drop `dist` folder or connect Git repository
- **GitHub Pages**: Use `gh-pages` branch deployment
- **Firebase Hosting**: `firebase deploy` after `firebase init`
- **AWS S3**: Static website hosting with CloudFront CDN

## 🎯 Production Readiness

### ✅ **Completed Production Features**

#### 🎨 **Visual Identity & Branding**
- ✅ Professional favicon.ico and favicon.svg
- ✅ Complete PWA icon set (72x72 to 512x512)
- ✅ Apple Touch Icons for iOS
- ✅ Windows tile configuration (browserconfig.xml)
- ✅ Consistent gradient branding (blue to indigo)

#### 📱 **Progressive Web App (PWA)**
- ✅ Comprehensive manifest.json with all required fields
- ✅ Service Worker for offline functionality
- ✅ PWA icons in multiple sizes and formats
- ✅ App shortcuts for quick USD/EUR conversion
- ✅ Proper theme colors and display modes
- ✅ iOS and Android optimizations

#### 🔍 **SEO & Meta Tags**
- ✅ Professional page title: "RateVault - Currency & Timezone Conversion"
- ✅ Comprehensive meta descriptions and keywords
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card metadata
- ✅ Structured data (JSON-LD) for search engines
- ✅ robots.txt for search engine crawling
- ✅ sitemap.xml for search indexing

#### 🚀 **Performance & Optimization**
- ✅ Production Vite configuration with Terser minification
- ✅ Console.log removal in production builds
- ✅ Proper caching headers in Vercel configuration
- ✅ Asset optimization and compression
- ✅ Chunk size optimization

#### 🛡️ **Error Handling & Reliability**
- ✅ React Error Boundary for graceful error handling
- ✅ Production-safe logging utilities
- ✅ Environment detection and appropriate logging
- ✅ Offline error states and user feedback
- ✅ Loading states and error recovery

#### 📄 **Legal & Compliance**
- ✅ Privacy Policy page (privacy-policy.html)
- ✅ GDPR-compliant data handling (local storage only)
- ✅ No tracking or analytics (privacy-focused)
- ✅ Clear data usage disclosure

#### 🔧 **Development & Build**
- ✅ TypeScript configuration for production
- ✅ ESLint configuration for code quality
- ✅ Production build script with proper minification
- ✅ Preview server configuration
- ✅ Package.json with proper metadata

#### 🌐 **Deployment Ready**
- ✅ Vercel configuration with optimized headers
- ✅ SPA routing configuration
- ✅ Static asset optimization
- ✅ Build output optimization

## 🏗️ Project Structure

```
src/
├── components/              # React components
│   ├── CurrencyInput.tsx       # Currency input with conversion
│   ├── CurrencySelector.tsx    # Currency selection modal
│   ├── MiniCalculator.tsx      # Built-in calculator with tip calc
│   ├── TimezoneConverter.tsx   # Timezone conversion interface
│   ├── StatusBar.tsx           # Online/offline status & updates
│   ├── UpdatePrompt.tsx        # PWA update notification
│   ├── RefreshWarningModal.tsx # PWA refresh education
│   ├── LanguagePicker.tsx      # Multi-language selector
│   ├── NumberSystemToggle.tsx  # Number format switcher
│   ├── PWAStatus.tsx           # PWA installation status
│   ├── OfflineNotice.tsx       # Offline mode indicator
│   └── ui/                     # Shared UI components
├── hooks/                   # Custom React hooks
│   ├── useCurrencyConverter.ts # Currency state management
│   ├── useTimezoneConverter.ts # Timezone functionality
│   ├── usePWA.ts              # PWA features & updates
│   ├── useLanguage.ts         # Multi-language support
│   └── useNumberSystem.ts     # Number formatting
├── contexts/                # React context providers
│   ├── NumberSystemContext.tsx # Global number format state
│   └── TimeContext.tsx        # Global time state
├── i18n/                   # Internationalization
│   ├── config.ts              # i18n configuration
│   └── locales/               # Translation files (10+ languages)
├── utils/                  # Utility functions
│   ├── api.ts                 # API calls and currency conversion
│   ├── storage.ts             # localStorage utilities
│   ├── numberSystem.ts        # Number formatting logic
│   └── env.ts                 # Environment configuration
├── pages/                  # Route pages
│   └── AboutPage.tsx          # Comprehensive about page
├── types.ts                # TypeScript type definitions
├── constants.ts            # App constants and currency data
├── App.tsx                 # Main app component with routing
└── main.tsx                # App entry point with PWA registration
```

## 💾 Data Storage & PWA Features

The app uses multiple storage mechanisms for optimal performance:

### LocalStorage Data
- **Exchange rates** with timestamps and expiry tracking
- **Pinned currencies** preferences
- **Custom exchange rates** for scenarios
- **Language preferences** and number system settings
- **User interface state** and personalization

### Service Worker Caching
- **Static assets** (HTML, CSS, JS) for instant loading
- **API responses** for offline functionality
- **Dynamic caching** of frequently accessed data
- **Background sync** for automatic updates

### Data Structure Examples
```typescript
// Exchange Rates
{
  exchangeRates: {
    base: "USD",
    rates: { "EUR": 0.92, "GBP": 0.79, ... },
    timestamp: 1703123456789,
    lastUpdated: "2024-12-20T10:30:00Z"
  },
  pinnedCurrencies: ["USD", "EUR", "GBP"],
  customRates: {
    "USD_EUR": 1.0,  // Custom rate overrides
    "USD_GBP": 0.85
  },
  userPreferences: {
    language: "en",
    numberSystem: "international",
    lastUsedCurrencies: ["USD", "EUR"]
  }
}
```

## 🌍 Supported Currencies & Languages

### 150+ Currencies Organized by Region

**Major Global Currencies:**
- USD (US Dollar), EUR (Euro), GBP (British Pound)
- JPY (Japanese Yen), CNY (Chinese Yuan)

**Major Developed Countries:**
- AUD, CAD, CHF, NZD, SEK, NOK, DKK

**Asian Currencies:**
- INR, KRW, SGD, HKD, THB, MYR, IDR, PHP, VND, TWD, PKR, LKR, BDT

**Middle East & Africa:**
- AED, SAR, QAR, KWD, BHD, OMR, JOD, ILS, EGP, ZAR, NGN, KES, GHS, MAD, TND

**European (Non-Euro):**
- PLN, CZK, HUF, RON, BGN, HRK, RSD, TRY, RUB, UAH, ISK

**Americas:**
- BRL, MXN, ARS, CLP, COP, PEN, UYU, BOB, PYG, GTQ, CRC, DOP, JMD, TTD

**Cryptocurrencies:**
- BTC (Bitcoin), ETH (Ethereum), BNB (Binance Coin), ADA (Cardano)
- SOL (Solana), XRP, DOT (Polkadot), DOGE (Dogecoin), AVAX, LUNA

### 10+ Languages with Full Localization
- **English** (en) - Default
- **Spanish** (es) - Español
- **French** (fr) - Français  
- **German** (de) - Deutsch
- **Portuguese** (pt) - Português
- **Russian** (ru) - Русский
- **Chinese** (zh) - 中文
- **Japanese** (ja) - 日本語
- **Hindi** (hi) - हिन्दी
- **Arabic** (ar) - العربية (RTL support)

## 🎯 Usage Guide

### Basic Currency Conversion
1. App loads with USD, EUR, GBP pinned by default
2. Enter amount in any currency field - others update automatically
3. Tap any exchange rate to set that currency as the base
4. Use the calculator to perform math, then apply to currencies

### PWA Installation & Updates
1. **Install**: Click the install prompt or browser install button
2. **Updates**: App automatically checks for new versions
3. **Update Modal**: Choose "Update Now" for immediate hard refresh
4. **Offline Mode**: Works completely offline with cached data

### Advanced Features
- **Custom Rates**: Set "what-if" scenarios with custom exchange rates
- **Number Systems**: Toggle between International and Indian formatting
- **Languages**: Switch languages instantly with full UI translation
- **Calculator**: Use built-in calculator with tip calculator
- **Timezone**: Convert times across different world regions

## 🎨 Design System & PWA Assets

### 🎨 **Standardized Color Palette**

#### Primary Colors
- **Primary Gradient**: `from-blue-600 to-purple-600`
- **Primary Blue**: `blue-600` (#3b82f6)
- **Primary Purple**: `purple-600` (#6366f1)

#### Background Colors
- **Main Background**: `from-slate-50 to-slate-100`
- **Card Background**: `bg-white/80 backdrop-blur-sm`
- **Input Background**: `from-slate-50 to-slate-100`
- **Dialog Background**: `from-slate-50 to-slate-100 backdrop-blur-sm`
- **Accent Background**: `from-blue-50 to-purple-50`
- **Status Bar**: `bg-white/80 backdrop-blur-sm`

#### Text Colors (Standardized)
- **Primary Text**: `text-slate-800` (headings, currency codes)
- **Secondary Text**: `text-slate-600` (descriptions, labels)
- **Muted Text**: `text-slate-500` (timestamps, symbols)
- **Search Icon**: `text-slate-500`

#### Border Colors (Consistent)
- **Primary Border**: `border-slate-200`
- **Card Border**: `border border-slate-200`
- **Focus Border**: `border-blue-400`
- **Hover Border**: `hover:border-blue-200`

#### Interactive States (Unified)
- **Hover Background**: `hover:from-blue-50 hover:to-purple-50`
- **Hover Text**: `hover:text-blue-700`
- **Focus Ring**: `focus:ring-blue-400/20`
- **Transition Duration**: `duration-200` (standardized)

#### Status Colors (Consistent)
- **Success**: `bg-green-50 text-green-700 border-green-200`
- **Warning**: `bg-orange-50 text-orange-700 border-orange-200`
- **Error**: `bg-red-50 text-red-700 border-red-200`
- **Destructive Hover**: `hover:bg-red-50 hover:text-red-600`

### 📝 **Typography Standards**
- **App Title**: `text-4xl font-bold` with gradient
- **Dialog Title**: `text-xl font-bold` with gradient
- **Currency Code**: `text-lg font-bold`
- **Currency Name**: `text-sm font-medium`
- **Input Text**: `text-xl font-bold`
- **Status Text**: `text-sm font-bold`
- **Button Text**: `text-sm font-medium`

### PWA Icons
The app includes a complete set of PWA icons located in `/public/icons/`:

**Available Icon Sizes:**
- `icon-72x72.svg` - For Windows tiles and small displays
- `icon-96x96.svg` - Standard Android icon
- `icon-128x128.svg` - Chrome Web Store icon
- `icon-144x144.svg` - Windows tile icon
- `icon-152x152.svg` - iPad icon
- `icon-192x192.svg` - Android homescreen icon
- `icon-384x384.svg` - Splash screen icon
- `icon-512x512.svg` - Large Android icon and splash screen

**Icon Design Features:**
- Base gradient background from blue (#3b82f6) to indigo (#6366f1)
- Currency conversion arrows and symbols ($, €)
- Scalable SVG format for crisp display at any size
- Consistent design across all sizes
- Material Design guidelines compliance for adaptive icons

### Color Scheme
- **Primary**: Blue (#3b82f6) to Purple (#6366f1) gradient
- **Background**: Slate gray tones (#f8fafc, #f1f5f9)
- **Text**: Slate variations (#334155, #64748b, #94a3b8)
- **Accent**: Various colors for status indicators and feature highlights

### Typography
- **Font Stack**: System fonts with fallbacks for optimal performance
- **Sizes**: Responsive typography scale from mobile to desktop
- **Weight**: Varied font weights for hierarchy and emphasis

## 🧪 Design Decisions & Architecture

### Offline-First Philosophy
The app prioritizes reliability through:
- **Caching exchange rates** locally with intelligent expiry
- **Working fully offline** using last known rates
- **Clear status indicators** for online/offline states
- **Graceful degradation** when APIs are unavailable

### State Management Strategy
Uses a custom React hook (`useCurrencyConverter`) providing:
- **Centralized state management** with TypeScript safety
- **Automatic localStorage persistence** for user preferences
- **Real-time currency conversion** with optimized calculations
- **Online/offline detection** with appropriate fallbacks

### User Experience Principles
- **Immediate feedback**: All changes reflect instantly without delay
- **Visual clarity**: Clear indicators for status, custom rates, and app state
- **Progressive enhancement**: Core functionality works even without JavaScript
- **Responsive design**: Optimal experience across all device sizes
- **Accessibility first**: Proper ARIA labels, keyboard navigation, and screen reader support

### Performance Optimizations
- **Lazy loading**: Components and features load on demand
- **Memoization**: Expensive calculations cached appropriately
- **Bundle splitting**: Code split for faster initial load times
- **Service worker caching**: Aggressive caching for instant app loading
- **Debounced updates**: Input changes optimized to prevent excessive API calls

## 🚀 Future Roadmap

### 🔮 **Core Features & Enhancements**

#### Historical Exchange Rates
- [ ] **Rate History Charts**: Show 7-day, 30-day, 1-year rate trends using Chart.js or Recharts
- [ ] **Historical Lookup**: Allow users to check rates for specific past dates
- [ ] **Rate Alerts**: Push notifications when currencies reach target rates
- [ ] **Best/Worst Rates**: Show highest/lowest rates in the last 30 days

#### Advanced Currency Features
- [ ] **Enhanced Cryptocurrency Support**: Expand to top 50+ cryptocurrencies with real-time data
- [ ] **Commodity Prices**: Gold, Silver, Oil pricing in various currencies
- [ ] **Central Bank Rates**: Official interest rates and monetary policy data
- [ ] **Currency Volatility Index**: Show stability metrics for each currency

#### Smart Calculations & Tools
- [ ] **Advanced Calculator Mode**: Scientific calculator with currency integration
- [ ] **Split Bill Calculator**: Divide expenses across different currencies
- [ ] **Travel Budget Planner**: Multi-destination trip expense planning
- [ ] **Investment Returns Calculator**: Foreign investment returns with currency impact

### 📊 **Data Visualization & Analytics**

#### Enhanced Charts & Graphs
- [ ] **Rate Comparison Matrix**: Compare multiple currencies side-by-side
- [ ] **Currency Strength Meter**: Visual representation of currency performance
- [ ] **Correlation Analysis**: How currencies move relative to each other
- [ ] **Economic Calendar**: Major economic events affecting currency rates

#### Market Insights
- [ ] **Daily Market Summary**: Key currency movers and market news integration
- [ ] **Central Bank Calendar**: Upcoming rate decisions and policy meetings
- [ ] **Economic Indicators**: GDP, inflation, unemployment impact visualization
- [ ] **Sentiment Analysis**: Market sentiment indicators for major currencies

### 🎯 **User Experience Improvements**

#### Personalization Features
- [ ] **User Profiles**: Cloud sync for preferences, favorites, and custom settings
- [ ] **Custom Themes**: Extended theme options beyond light/dark modes
- [ ] **Dashboard Layouts**: Fully customizable widget arrangements
- [ ] **Quick Access Bar**: Advanced pinning system for currency pairs

#### Advanced Search & Filtering
- [ ] **Smart Search**: Search by country, region, or currency characteristics
- [ ] **Advanced Filters**: By continent, currency type, volatility level
- [ ] **Recent History**: Enhanced recently used currencies with timestamps
- [ ] **Favorites Categories**: Organized favoriting system with custom groups

### Technical Improvements
- [ ] **Progressive Loading**: Advanced skeleton screens and loading strategies
- [ ] **Enhanced PWA**: Background sync, push notifications, and native integrations
- [ ] **Advanced Caching**: Smarter cache invalidation and update strategies
- [ ] **Performance Monitoring**: Real user monitoring and performance analytics
- [ ] **Accessibility Audit**: Comprehensive accessibility testing and improvements
- [ ] **Bundle Optimization**: Further code splitting and tree shaking improvements

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. **Fork** the repository
2. **Clone** your fork: `git clone <your-fork-url>`
3. **Install** dependencies: `npm install`
4. **Create** feature branch: `git checkout -b feature/amazing-feature`
5. **Start** dev server: `npm run dev`

### Contribution Guidelines
- **Code Style**: Follow ESLint rules and Prettier formatting
- **TypeScript**: Maintain full type safety throughout the codebase
- **Components**: Use Radix UI primitives for accessibility and consistency
- **i18n**: Add translations for new text content across all supported languages
- **Testing**: Test across different browsers, devices, and network conditions
- **PWA**: Ensure new features work properly in offline mode

### Areas for Contribution
- **New Features**: Additional calculators, more timezone features, enhanced PWA capabilities
- **Translations**: Additional language support beyond current 10+ languages
- **UI/UX**: Design improvements, accessibility enhancements, and user experience optimizations
- **Performance**: Bundle size optimization, loading improvements, and caching strategies
- **APIs**: Additional exchange rate providers, backup systems, and data sources
- **Documentation**: Code comments, user guides, and developer documentation

### Pull Request Process
1. **Update** translations if you added new text content
2. **Test** thoroughly on multiple browsers, screen sizes, and network conditions
3. **Document** new features in README, code comments, and user-facing documentation
4. **Verify** PWA functionality works correctly offline and with service workers
5. **Submit** PR with clear description of changes, screenshots, and testing notes

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Open Source
- Free to use, modify, and distribute
- Commercial use permitted
- Attribution appreciated but not required

## 🙏 Acknowledgments

- **ExchangeRate-API** - Reliable exchange rate data
- **React Team** - Amazing framework and ecosystem
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling approach
- **Community Contributors** - Bug reports, feature requests, and translations

---

<div align="center">
  <strong>⭐ Star this repository if you find it helpful!</strong><br>
  <sub>Built with ❤️ for travelers who need reliable tools on every trip</sub>
</div>
