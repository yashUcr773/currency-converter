// Currency Converter PWA Service Worker with Timezone Support
const CACHE_VERSION = 'v1.12.0';
const STATIC_CACHE_NAME = 'currency-converter-static-v1.14.0';
const DATA_CACHE_NAME = 'ratevault-data-v1.14.0';
const TIMEZONE_CACHE_NAME = 'currency-converter-timezone-v1.14.0';

// Detect if we're in development mode
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.startsWith('192.168.') || location.hostname.startsWith('10.') || location.hostname.includes('local');

// Security headers for cached responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': isDevelopment ? 'SAMEORIGIN' : 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Only add CSP in production
if (!isDevelopment) {
}

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets as needed
];

// API endpoints to cache
const API_ENDPOINTS = [
  'https://api.exchangerate-api.com/v4/latest/USD',
  // Add other API endpoints as needed
];

// Timezone data to cache
const TIMEZONE_DATA_KEYS = [
  'ratevault-timezone-data',
  'timezone-country-mapping',
  'timezone-constants'
];

// Helper function to add security headers to responses
function addSecurityHeaders(response) {
  if (!response) return response;
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers)
  });
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  
  return newResponse;
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches and notify clients of update
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DATA_CACHE_NAME &&
              cacheName !== CACHE_NAME &&
              cacheName !== TIMEZONE_CACHE_NAME
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim(),
      // Notify all clients that an update is available
      notifyClientsOfUpdate()
    ])
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-HTTP(S) requests (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) {
    console.log('[SW] Skipping non-HTTP request:', url.protocol, url.href);
    return;
  }
  
  // Skip requests that can't be cached
  if (event.request.method !== 'GET') {
    console.log('[SW] Skipping non-GET request:', event.request.method, url.href);
    return;
  }
  
  // Skip browser extension requests explicitly
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:' || url.protocol === 'ms-browser-extension:') {
    console.log('[SW] Skipping browser extension request:', url.href);
    return;
  }
  
  // Skip development module requests (Vite dev server)
  if (url.pathname.startsWith('/src/') || url.pathname.includes('node_modules') || url.searchParams.has('import')) {
    console.log('[SW] Skipping development module request:', url.href);
    return;
  }
  
  // Handle API requests (currency data) with minimal interference
  if (url.origin.includes('exchangerate-api.com') || url.pathname.includes('/api/')) {
    console.log('[SW] Handling API request with minimal interference:', url.href);
    event.respondWith(handleApiRequestSimple(event.request));
    return;
  }
  
  // Handle static assets for same origin requests only
  if (url.origin === location.origin) {
    console.log('[SW] Handling static request:', url.href);
    event.respondWith(handleStaticRequest(event.request));
    return;
  }
  
  // Log skipped requests for debugging
  console.log('[SW] Skipping cross-origin request:', url.href);
});

// Simplified API request handler that doesn't interfere with headers
async function handleApiRequestSimple(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  
  try {
    // Try network first - return original response without modification
    console.log('[SW] Attempting network request (simple):', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the original response
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      console.log('[SW] Cached original response:', request.url);
      
      // Return the original unmodified response
      return networkResponse;
    } else {
      throw new Error(`HTTP ${networkResponse.status}`);
    }
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error.message);
    
    // Only try cache if we're offline
    if (!navigator.onLine) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('[SW] Serving from cache (simple):', request.url);
        return addSecurityHeaders(cachedResponse);
      }
    }
    
    // Let the error bubble up naturally
    throw error;
  }
}

// Handle API requests with cache-first strategy for offline support
async function handleApiRequest(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  const url = new URL(request.url);
  
  // Safety check - only handle HTTPS API requests
  if (!url.protocol.startsWith('http')) {
    return fetch(request);
  }
  
  try {
    // Try network first for fresh data
    console.log('[SW] Attempting network request for:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && networkResponse.status < 400) {
      // Cache successful responses only
      console.log('[SW] Network request successful, caching response');
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      console.log('[SW] API data cached:', request.url);
      
      // Add timestamp to track cache freshness but preserve original headers
      const responseData = await networkResponse.clone().json();
      
      // Create headers object preserving original CORS headers
      const responseHeaders = new Headers(networkResponse.headers);
      responseHeaders.set('Content-Type', 'application/json');
      
      // Ensure CORS headers are present
      if (!responseHeaders.has('Access-Control-Allow-Origin')) {
        responseHeaders.set('Access-Control-Allow-Origin', '*');
      }
      
      const timestampResponse = new Response(
        JSON.stringify({
          ...responseData,
          sw_cached_at: Date.now()
        }),
        {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers: responseHeaders
        }
      );
      
      return timestampResponse;
    } else {
      console.log('[SW] Network response not ok:', networkResponse.status, networkResponse.statusText);
      throw new Error(`Network response not ok: ${networkResponse.status}`);
    }
  } catch (error) {
    console.log('[SW] Network failed:', error.message, 'Trying cache for:', request.url);
    
    // Only use cache if we're actually offline (not on API errors)
    if (!navigator.onLine) {
      // Fall back to cache if network fails and we're offline
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('[SW] Serving from cache (offline):', request.url);
        return addSecurityHeaders(cachedResponse);
      }
      
      // If no cache available and we're offline, return offline response
      console.log('[SW] No cache available while offline');
      return new Response(
        JSON.stringify({
          error: 'Offline - No cached data available',
          offline: true,
          message: 'You are currently offline. Please check your internet connection.'
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } else {
      // If we're online but the network request failed, let it fail naturally
      // This could be due to API rate limits, CORS issues, etc.
      console.log('[SW] Network error while online, letting request fail naturally');
      throw error;
    }
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const url = new URL(request.url);
  
  // Additional safety check - only cache HTTP(S) requests from same origin
  if (!url.protocol.startsWith('http') || url.origin !== location.origin) {
    return fetch(request);
  }
  
  // Try cache first for static assets
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return addSecurityHeaders(cachedResponse);
  }
  
  // If not in cache, try network and cache the response
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.status < 400) {
      // Only cache successful responses
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    return addSecurityHeaders(networkResponse);
  } catch (error) {
    // If it's the main page and we're offline, serve from cache or show offline page
    if (request.mode === 'navigate') {
      const cachedIndex = await cache.match('/index.html');
      if (cachedIndex) {
        return addSecurityHeaders(cachedIndex);
      }
    }
    
    throw error;
  }
}

// Notify all clients that an update is available
async function notifyClientsOfUpdate() {
  try {
    console.log('[SW] Notifying clients of available update');
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('[SW] Failed to notify clients of update:', error);
  }
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered');
  
  if (event.tag === 'currency-data-sync') {
    event.waitUntil(syncCurrencyData());
  }
});

// Sync currency data when connection is restored
async function syncCurrencyData() {
  try {
    console.log('[SW] Syncing currency data in background');
    
    // Fetch fresh data for common currencies
    const commonCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
    const fetchPromises = commonCurrencies.map(currency => 
      fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
    );
    
    await Promise.allSettled(fetchPromises);
    console.log('[SW] Background sync completed');
    
    // Notify all clients about fresh data
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'DATA_SYNCED',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notifications (for future rate alerts feature)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Currency rate alert',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Rates',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Currency Converter', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
  // 'dismiss' action or clicking notification body - just close
});

// Timezone data caching functions
async function cacheTimezoneData(key, data) {
  try {
    const cache = await caches.open(TIMEZONE_CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Timestamp': Date.now().toString()
      }
    });
    await cache.put(key, response);
    console.log('[SW] Timezone data cached:', key);
  } catch (error) {
    console.error('[SW] Error caching timezone data:', error);
  }
}

async function getTimezoneData(key) {
  try {
    const cache = await caches.open(TIMEZONE_CACHE_NAME);
    const response = await cache.match(key);
    if (response) {
      const data = await response.json();
      console.log('[SW] Timezone data retrieved from cache:', key);
      return data;
    }
  } catch (error) {
    console.error('[SW] Error retrieving timezone data:', error);
  }
  return null;
}

// Message handling from main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_TIMEZONE_DATA':
      cacheTimezoneData(data.key, data.value).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'GET_TIMEZONE_DATA':
      getTimezoneData(data.key).then(result => {
        event.ports[0].postMessage({ data: result });
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Get cache status for app
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const cacheStatus = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    cacheStatus[cacheName] = {
      count: keys.length,
      size: await getCacheSize(cache)
    };
  }
  
  return cacheStatus;
}

// Calculate cache size
async function getCacheSize(cache) {
  const keys = await cache.keys();
  let size = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      size += blob.size;
    }
  }
  
  return size;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}
