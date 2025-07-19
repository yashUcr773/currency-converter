# PWA Icons

This directory contains the PWA icons for Currency Converter Pro.

## Available Icon Sizes:
✅ `icon-72x72.svg` - For Windows tiles and small displays
✅ `icon-96x96.svg` - Standard Android icon
✅ `icon-128x128.svg` - Chrome Web Store icon
✅ `icon-144x144.svg` - Windows tile icon
✅ `icon-152x152.svg` - iPad icon
✅ `icon-192x192.svg` - Android homescreen icon
✅ `icon-384x384.svg` - Splash screen icon
✅ `icon-512x512.svg` - Large Android icon and splash screen

## Icon Design:
- Base gradient background from blue (#3b82f6) to indigo (#6366f1)
- Currency conversion arrows and symbols ($, €)
- Scalable SVG format for crisp display at any size
- Consistent design across all sizes

## Generation Instructions:
The icons are provided as SVG files for optimal scalability and quality.
If PNG versions are needed for specific platforms, you can:

1. Use an online SVG to PNG converter
2. Use tools like:
   - https://realfavicongenerator.net/
   - https://favicon.io/favicon-generator/
   - https://www.pwabuilder.com/imageGenerator

## Production Notes:
✅ All required PWA icon sizes are included
✅ Icons follow Material Design guidelines for adaptive icons
✅ SVG format ensures crisp display on all devices and screen densities

## Icon Design Guidelines:
- Use the app's color scheme (blue-purple gradient)
- Include a currency symbol or converter icon
- Ensure good contrast and readability at all sizes
- Test on different backgrounds (light/dark)

## Temporary Solution:
For development purposes, you can copy the same icon file to all required sizes.
In production, properly sized icons should be generated for optimal quality.

## Files Needed:
```
/public/icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

The PWA will work without these icons, but users will see generic browser icons instead of your app's branding.
