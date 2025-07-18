# PWA Icons Placeholder

This directory should contain the following PWA icons:

## Required Icon Sizes:
- `icon-72x72.png` - For Windows tiles and small displays
- `icon-96x96.png` - Standard Android icon
- `icon-128x128.png` - Chrome Web Store icon
- `icon-144x144.png` - Windows tile icon
- `icon-152x152.png` - iPad icon
- `icon-192x192.png` - Android homescreen icon
- `icon-384x384.png` - Splash screen icon
- `icon-512x512.png` - Large Android icon and splash screen

## Generation Instructions:
1. Create a base icon design (preferably 512x512px)
2. Use an online icon generator like:
   - https://realfavicongenerator.net/
   - https://favicon.io/favicon-generator/
   - https://www.pwabuilder.com/imageGenerator

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
