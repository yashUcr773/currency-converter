# Clerk CSP Configuration

If you're still experiencing CSP issues with Clerk, here are the specific domains that need to be allowed:

## Required Clerk Domains

### For Script Sources (`script-src`):
- `https://*.clerk.accounts.dev` (for test environments)
- `https://*.clerk.com` (for production)
- `https://clerk.com`

### For Style Sources (`style-src`):
- `https://*.clerk.accounts.dev`
- `https://*.clerk.com`

### For Image Sources (`img-src`):
- `https://*.clerk.accounts.dev`
- `https://*.clerk.com`
- `https://img.clerk.com`

### For Connect Sources (`connect-src`):
- `https://*.clerk.accounts.dev`
- `https://*.clerk.com`
- `https://api.clerk.com`
- `https://clerk.com`

### For Frame Sources (`frame-src`):
- `https://*.clerk.accounts.dev`
- `https://*.clerk.com`

## Current CSP Configuration

The app now has a permissive CSP for development that should allow all Clerk requests. In production, the CSP will be more restrictive but still include all necessary Clerk domains.

## Troubleshooting CSP Issues

1. **Check Browser Console**: Look for CSP violation errors
2. **Disable CSP Temporarily**: Comment out the CSP meta tag in `index.html` to test
3. **Check Network Tab**: See if Clerk requests are being blocked
4. **Environment Specific**: Development CSP is more permissive than production

## Alternative Solutions

If CSP continues to block Clerk:

1. **Remove CSP Meta Tag**: Comment out or remove the CSP meta tag from `index.html`
2. **Use HTTP Headers Only**: Rely on Vercel configuration for production CSP
3. **Environment-Based CSP**: Different CSP rules for dev vs production

## Files Updated

- `index.html`: Added permissive CSP meta tag
- `vite.config.ts`: Added development server headers
- `vercel.json`: Production CSP headers
- `public/sw.js`: Service worker CSP headers

The current configuration should work with Clerk. If issues persist, try temporarily removing the CSP meta tag from `index.html`.
