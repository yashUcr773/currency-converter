// SEO utility functions and constants

export const SEO_CONSTANTS = {
  SITE_NAME: 'RateVault',
  SITE_URL: 'https://ratevault.uk',
  DEFAULT_TITLE: 'RateVault - Free Currency & Timezone Converter | Real-Time Exchange Rates',
  DEFAULT_DESCRIPTION: 'Free online currency converter and world clock with real-time exchange rates for 170+ currencies. Convert money and time zones instantly. Progressive Web App with offline support.',
  DEFAULT_KEYWORDS: 'currency converter, exchange rates, timezone converter, world clock, free currency conversion, real-time rates, USD EUR GBP, time zones, UTC converter, money converter, forex rates',
  DEFAULT_IMAGE: '/icons/icon-512x512.svg',
  TWITTER_HANDLE: '@ratevault',
  LANGUAGES: ['en', 'es', 'fr', 'de', 'pt', 'ru', 'zh', 'ja', 'ar', 'hi'] as const
};

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonical?: string;
  noIndex?: boolean;
}

// Generate currency-specific SEO metadata
export function getCurrencyPairSEO(from: string, to: string): SEOMetadata {
  return {
    title: `${from} to ${to} Converter - Live Exchange Rate | RateVault`,
    description: `Convert ${from} to ${to} with real-time exchange rates. Free currency converter with historical data and accurate calculations. ${from}/${to} exchange rate updated daily.`,
    keywords: `${from} to ${to}, ${from}${to}, ${from.toLowerCase()} ${to.toLowerCase()}, exchange rate, currency converter, ${from} exchange rate, ${to} exchange rate`,
    canonical: `https://ratevault.uk/?from=${from}&to=${to}`
  };
}

// Generate timezone-specific SEO metadata
export function getTimezoneSEO(timezone: string): SEOMetadata {
  const timezoneName = timezone.replace(/_/g, ' ').replace('/', ' - ');
  
  return {
    title: `${timezoneName} Time Zone Converter | Current Time | RateVault`,
    description: `Current time in ${timezoneName} timezone. Convert time zones instantly with accurate world clock. Check what time it is in ${timezoneName} right now.`,
    keywords: `${timezoneName}, ${timezone}, time zone, world clock, current time, time converter, UTC time, ${timezoneName.toLowerCase()} time`,
    canonical: `https://ratevault.uk/?timezone=${encodeURIComponent(timezone)}`
  };
}

// Popular currency pairs for SEO
export const POPULAR_CURRENCY_PAIRS = [
  { from: 'USD', to: 'EUR' },
  { from: 'USD', to: 'GBP' },
  { from: 'USD', to: 'JPY' },
  { from: 'USD', to: 'CAD' },
  { from: 'USD', to: 'AUD' },
  { from: 'EUR', to: 'USD' },
  { from: 'EUR', to: 'GBP' },
  { from: 'GBP', to: 'USD' },
  { from: 'GBP', to: 'EUR' },
  { from: 'JPY', to: 'USD' },
  { from: 'CAD', to: 'USD' },
  { from: 'AUD', to: 'USD' },
  { from: 'CHF', to: 'USD' },
  { from: 'CNY', to: 'USD' },
  { from: 'INR', to: 'USD' }
];

// Popular timezones for SEO
export const POPULAR_TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles', 
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'America/Toronto',
  'Asia/Kolkata',
  'Europe/Berlin',
  'Asia/Singapore',
  'America/Chicago',
  'Europe/Rome',
  'Asia/Hong_Kong'
];

// Update page title dynamically
export function updatePageTitle(title: string): void {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}

// Update meta description dynamically
export function updateMetaDescription(description: string): void {
  if (typeof document !== 'undefined') {
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }
}

// Generate breadcrumb JSON-LD
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Generate FAQ schema for currency/timezone questions
export function generateFAQSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is RateVault free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, RateVault is completely free to use. No registration or payment required for currency conversion and timezone tools."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are the exchange rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our exchange rates are updated in real-time from reliable financial data sources, ensuring high accuracy for currency conversions. Rates are refreshed multiple times per day."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use RateVault offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, RateVault is a Progressive Web App (PWA) that works offline using cached exchange rates and timezone data. You can install it on your device for offline access."
        }
      },
      {
        "@type": "Question",
        "name": "How many currencies are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RateVault supports over 170 currencies from around the world, including all major currencies like USD, EUR, GBP, JPY, CAD, AUD, and many more."
        }
      },
      {
        "@type": "Question",
        "name": "Does RateVault support cryptocurrency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, RateVault focuses on traditional fiat currencies. Cryptocurrency support may be added in future updates."
        }
      }
    ]
  };
}

// SEO-friendly URL slugs
export function createSEOSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Check if current page needs SEO updates
export function shouldUpdateSEO(currentTitle: string, newTitle: string): boolean {
  return currentTitle !== newTitle && newTitle.trim().length > 0;
}
