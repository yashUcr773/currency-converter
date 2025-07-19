import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = 'Currency Converter Pro - Real-time Exchange Rates',
  description = 'Professional currency converter with real-time exchange rates, offline support, and beautiful interface. Convert between 170+ currencies instantly.',
  keywords = 'currency converter, exchange rates, forex, currency exchange, money converter, real-time rates',
  image = '/icons/icon-512x512.svg',
  url = window.location.href
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: image },
      { name: 'apple-mobile-web-app-title', content: title.split(' - ')[0] }
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
  }, [title, description, keywords, image, url]);

  return null;
}

// Structured data for better SEO
export function StructuredData() {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Currency Converter Pro",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "description": "Professional currency converter with real-time exchange rates and offline support",
      "url": window.location.origin,
      "author": {
        "@type": "Organization",
        "name": "Currency Converter Pro Team"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Real-time exchange rates",
        "Offline support", 
        "170+ currencies",
        "Progressive Web App",
        "Mobile responsive"
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
