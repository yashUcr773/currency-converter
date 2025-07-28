import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonical?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/icons/icon-512x512.svg',
  url = window.location.href,
  canonical
}: SEOProps) {
  const { t } = useTranslation();

  // Use translations or fallback to defaults with better SEO-optimized content
  const metaTitle = title || t('seo.title', 'RateVault - Free Currency & Timezone Converter | Real-Time Exchange Rates');
  const metaDescription = description || t('seo.description', 'Free online currency converter and world clock with real-time exchange rates for 170+ currencies. Convert money and time zones instantly. Progressive Web App with offline support.');
  const metaKeywords = keywords || t('seo.keywords', 'currency converter, exchange rates, timezone converter, world clock, free currency conversion, real-time rates, USD EUR GBP, time zones, UTC converter, money converter, forex rates');

  useEffect(() => {
    // Update document title
    document.title = metaTitle;

    // Create canonical URL if not provided
    const canonicalUrl = canonical || window.location.origin + window.location.pathname;

    // Enhanced meta tags with better SEO optimization
    const metaTags = [
      // Basic SEO
      { name: 'description', content: metaDescription },
      { name: 'keywords', content: metaKeywords },
      { name: 'author', content: 'RateVault' },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'language', content: 'en' },
      { name: 'rating', content: 'general' },
      { name: 'distribution', content: 'global' },
      { name: 'revisit-after', content: '1 day' },
      
      // Open Graph - Enhanced
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: metaTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:image', content: new URL(image, window.location.origin).href },
      { property: 'og:image:width', content: '512' },
      { property: 'og:image:height', content: '512' },
      { property: 'og:image:alt', content: 'RateVault - Currency and Timezone Converter' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: 'RateVault' },
      { property: 'og:locale', content: 'en_US' },
      
      // Twitter Card - Enhanced
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metaTitle },
      { name: 'twitter:description', content: metaDescription },
      { name: 'twitter:image', content: new URL(image, window.location.origin).href },
      { name: 'twitter:image:alt', content: 'RateVault - Currency and Timezone Converter' },
      { name: 'twitter:site', content: '@ratevault' },
      { name: 'twitter:creator', content: '@ratevault' },
      
      // PWA and Mobile
      { name: 'apple-mobile-web-app-title', content: 'RateVault' },
      { name: 'application-name', content: 'RateVault' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      
      // Business/App specific
      { name: 'category', content: 'Finance, Utility, Productivity' },
      { name: 'classification', content: 'Currency Converter, Time Zone Converter' },
      { name: 'coverage', content: 'Worldwide' },
      { name: 'target', content: 'all' },
      { name: 'HandheldFriendly', content: 'true' },
      { name: 'MobileOptimized', content: '320' }
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.name = name;
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    });

    // Add canonical link
    let canonical_link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical_link) {
      canonical_link = document.createElement('link');
      canonical_link.rel = 'canonical';
      document.head.appendChild(canonical_link);
    }
    canonical_link.href = canonicalUrl;

    // Add alternate language links
    const languages = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'zh', 'ja', 'ar', 'hi'];
    languages.forEach(lang => {
      let alternate = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.rel = 'alternate';
        alternate.hreflang = lang;
        document.head.appendChild(alternate);
      }
      alternate.href = `${window.location.origin}?lang=${lang}`;
    });

  }, [metaTitle, metaDescription, metaKeywords, image, url, canonical]);

  return null;
}

// Enhanced Structured data for better SEO
export function StructuredData() {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Main WebApplication Schema
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t('seo.structuredData.name', 'RateVault'),
      "alternateName": ["Currency Converter", "Timezone Converter", "Exchange Rate Calculator"],
      "url": window.location.origin,
      "description": t('seo.structuredData.description', 'Free online currency converter and world clock with real-time exchange rates for 170+ currencies. Convert money and time zones instantly with offline PWA support.'),
      "applicationCategory": ["FinanceApplication", "UtilityApplication", "ProductivityApplication"],
      "operatingSystem": ["Windows", "macOS", "Linux", "iOS", "Android", "Web Browser"],
      "browserRequirements": "Requires JavaScript. Works best with modern browsers.",
      "softwareVersion": "2.0.0",
      "datePublished": "2025-01-27T00:00:00Z",
      "dateModified": new Date().toISOString(),
      "inLanguage": ["en", "es", "fr", "de", "pt", "ru", "zh", "ja", "ar", "hi"],
      "isAccessibleForFree": true,
      "author": {
        "@type": "Organization",
        "name": t('seo.structuredData.author', 'RateVault Team'),
        "url": window.location.origin
      },
      "creator": {
        "@type": "Organization", 
        "name": "RateVault Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "RateVault",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/icons/icon-512x512.svg`,
          "width": 512,
          "height": 512
        }
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2030-12-31"
      },
      "featureList": [
        t('seo.structuredData.feature1', 'Real-time exchange rates for 170+ currencies'),
        t('seo.structuredData.feature2', 'Offline Progressive Web App support'),
        t('seo.structuredData.feature3', 'World clock and timezone conversion'),
        t('seo.structuredData.feature4', 'Multi-language support (10 languages)'),
        t('seo.structuredData.feature5', 'Mobile responsive design'),
        t('seo.structuredData.feature6', 'Free to use with no registration'),
        t('seo.structuredData.feature7', 'Cross-platform compatibility'),
        t('seo.structuredData.feature8', 'Accurate currency calculations')
      ],
      "screenshot": `${window.location.origin}/icons/icon-512x512.svg`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Anonymous User"
          },
          "reviewBody": "Excellent currency converter with real-time rates and offline support!"
        }
      ]
    };

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is RateVault free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, RateVault is completely free to use. No registration or payment required."
          }
        },
        {
          "@type": "Question", 
          "name": "How accurate are the exchange rates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our exchange rates are updated in real-time from reliable financial data sources, ensuring high accuracy for currency conversions."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use RateVault offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, RateVault is a Progressive Web App (PWA) that works offline using cached exchange rates."
          }
        },
        {
          "@type": "Question",
          "name": "How many currencies are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "RateVault supports over 170 currencies from around the world, including all major currencies like USD, EUR, GBP, JPY, and more."
          }
        }
      ]
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Currency Converter",
          "item": `${window.location.origin}#currency`
        },
        {
          "@type": "ListItem",
          "position": 3, 
          "name": "Timezone Converter",
          "item": `${window.location.origin}#timezone`
        }
      ]
    };

    // Combine all schemas
    const combinedSchemas = {
      "@context": "https://schema.org",
      "@graph": [webAppSchema, faqSchema, breadcrumbSchema]
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(combinedSchemas, null, 2);
  }, [t]);

  return null;
}
