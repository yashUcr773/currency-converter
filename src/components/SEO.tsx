import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/icons/icon-512x512.svg',
  url = window.location.href
}: SEOProps) {
  const { t } = useTranslation();

  // Use translations or fallback to defaults
  const metaTitle = title || t('seo.title', 'Currency Converter Pro - Real-time Exchange Rates');
  const metaDescription = description || t('seo.description', 'Professional currency converter with real-time exchange rates, offline support, and beautiful interface. Convert between 170+ currencies instantly.');
  const metaKeywords = keywords || t('seo.keywords', 'currency converter, exchange rates, forex, currency exchange, money converter, real-time rates');

  useEffect(() => {
    // Update document title
    document.title = metaTitle;

    // Update meta tags
    const metaTags = [
      { name: 'description', content: metaDescription },
      { name: 'keywords', content: metaKeywords },
      { property: 'og:title', content: metaTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'twitter:title', content: metaTitle },
      { property: 'twitter:description', content: metaDescription },
      { property: 'twitter:image', content: image },
      { name: 'apple-mobile-web-app-title', content: metaTitle.split(' - ')[0] }
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
  }, [metaTitle, metaDescription, metaKeywords, image, url]);

  return null;
}

// Structured data for better SEO
export function StructuredData() {
  const { t } = useTranslation();
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t('seo.structuredData.name', 'Currency Converter Pro'),
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "description": t('seo.structuredData.description', 'Professional currency converter with real-time exchange rates and offline support'),
      "url": window.location.origin,
      "author": {
        "@type": "Organization",
        "name": t('seo.structuredData.author', 'Currency Converter Pro Team')
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        t('seo.structuredData.feature1', 'Real-time exchange rates'),
        t('seo.structuredData.feature2', 'Offline support'),
        t('seo.structuredData.feature3', '170+ currencies'),
        t('seo.structuredData.feature4', 'Progressive Web App'),
        t('seo.structuredData.feature5', 'Mobile responsive')
      ]
    };

    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
}
