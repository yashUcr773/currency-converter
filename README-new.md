# RateVault

**Currency and Timezone Conversion — in One Vault**

A lightweight, offline-first conversion application that allows users to convert currencies, manage timezones, pin frequently used currencies, and set custom exchange rates for "what-if" scenarios.

## ✨ Features

### 🔄 **Core Currency Conversion**
- **Two-way sync**: Updating one currency automatically updates all others
- **Real-time conversion** with decimal support (2 decimal places)
- **Automatic rate fetching** from ExchangeRate-API

### 📌 **Currency Pinning**
- **Pin/unpin currencies** from a comprehensive list
- **Persistent storage** - your preferences are remembered across sessions
- **Only pinned currencies** show in the main conversion interface
- **Easy management** with intuitive add/remove controls

### 🌐 **Offline-First Support**
- **Works offline** using last known exchange rates stored in localStorage
- **Visual indicators** showing online/offline status and last update time
- **Rate expiry notifications** when rates are older than 24 hours
- **Manual refresh option** when back online

### 🧮 **Custom "What-if" Scenarios**
- **Override exchange rates** to test custom scenarios
- **Visual indicators** when custom rates are active
- **Easy reset** back to official rates
- **Persistent custom rates** stored locally

### 📱 **Modern UI/UX**
- **Responsive design** works on desktop, tablet, and mobile
- **Tailwind CSS** for clean, modern styling
- **Intuitive controls** with hover states and transitions
- **Loading states** and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd currency-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── CurrencyInput.tsx    # Individual currency input/display
│   ├── CurrencySelector.tsx # Currency selection modal
│   ├── StatusBar.tsx        # Online/offline status
│   └── LoadingSpinner.tsx   # Loading indicator
├── hooks/
│   └── useCurrencyConverter.ts # Main state management hook
├── utils/
│   ├── api.ts               # API calls and currency conversion
│   └── storage.ts           # localStorage utilities
├── types.ts              # TypeScript type definitions
├── constants.ts          # App constants and currency data
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## 💾 Data Storage

The app uses localStorage to persist:

- **Exchange rates** with timestamps
- **Pinned currencies** list
- **Custom exchange rates** for scenarios

Data structure:
```typescript
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
  }
}
```

## 🔧 Configuration

### Supported Currencies
The app includes **150+ currencies** from around the world, organized by region:

**Major Global Currencies:**
- USD, EUR, GBP, JPY, CNY

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

**Additional Global Currencies:**
- Over 100 additional currencies from countries across Africa, Asia, Europe, and the Pacific

**Cryptocurrencies:**
- BTC (Bitcoin), ETH (Ethereum), BNB (Binance Coin), ADA (Cardano)
- SOL (Solana), XRP, DOT (Polkadot), DOGE (Dogecoin), AVAX (Avalanche), LUNA (Terra Luna)

*Note: Cryptocurrency rates may not be available in all exchange rate APIs*

### API Configuration
- **API Provider**: ExchangeRate-API (free tier)
- **Base URL**: `https://api.exchangerate-api.com/v4/latest`
- **Rate Expiry**: 24 hours
- **Fallback**: Cached rates in localStorage

## 🎯 Usage Guide

### Basic Conversion
1. The app loads with USD, EUR, and GBP pinned by default
2. Enter an amount in any currency field
3. All other currencies update automatically

### Adding Currencies
1. Click the "Add Currency" card
2. Search for or select a currency from the list
3. The currency is added to your pinned list

### Custom Rates
1. Click "Set Custom Rate" on any currency
2. Enter your desired exchange rate
3. The currency shows a "Custom Rate" indicator
4. Click "Reset to Official" to return to real rates

### Managing Offline Mode
- The app works completely offline using cached rates
- Status bar shows when you're offline and when rates were last updated
- Click "Refresh" when back online to get latest rates

## 🛠️ Built With

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **ExchangeRate-API** - Exchange rate data

## 📋 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for React and TypeScript
- Consistent naming conventions
- Type-safe development

## 🎨 Design Decisions

### Offline-First Architecture
The app prioritizes reliability by:
- Caching exchange rates locally
- Working fully offline with last known rates
- Showing clear status indicators
- Graceful degradation when API is unavailable

### State Management
Uses a custom React hook (`useCurrencyConverter`) for:
- Centralized state management
- Automatic localStorage persistence
- Real-time currency conversion
- Online/offline detection

### User Experience
- **Immediate feedback**: Changes reflect instantly
- **Visual clarity**: Clear indicators for status and custom rates
- **Progressive enhancement**: Core functionality works without JavaScript
- **Responsive design**: Works on all device sizes

## 🚀 Future Enhancements

- [ ] **Additional APIs**: Support for multiple exchange rate providers
- [ ] **Historical data**: Currency rate charts and trends
- [ ] **Rate alerts**: Notifications when currencies reach target rates  
- [ ] **PWA support**: Mobile app-like experience with offline installation
- [ ] **Calculation history**: Track and review past conversions
- [ ] **Import/Export**: Backup and restore settings and custom rates
- [ ] **Dark mode**: Alternative theme for better UX
- [ ] **Multi-base currency**: Support for non-USD base conversions
- [ ] **Regional filters**: Filter currencies by continent or region
- [ ] **Favorites**: Mark most-used currencies for quick access

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for practical currency conversion needs**
