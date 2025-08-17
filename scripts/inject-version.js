import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`🔧 Updating files with version ${version}...`);

// 1. Update service worker cache versions
const swPath = path.join(__dirname, '..', 'public', 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');

// Generate cache version (increment minor for cache busting)
const [major, minor, patch] = version.split('.').map(Number);
const cacheVersion = `${major}.${minor + 1}.${patch}`;

// Replace cache versions in service worker
swContent = swContent.replace(/const CACHE_NAME = 'currency-converter-v[^']+';/, `const CACHE_NAME = 'currency-converter-v${cacheVersion}';`);
swContent = swContent.replace(/const STATIC_CACHE_NAME = 'currency-converter-static-v[^']+';/, `const STATIC_CACHE_NAME = 'currency-converter-static-v${cacheVersion}';`);
swContent = swContent.replace(/const DATA_CACHE_NAME = 'ratevault-data-v[^']+';/, `const DATA_CACHE_NAME = 'ratevault-data-v${cacheVersion}';`);
swContent = swContent.replace(/const TIMEZONE_CACHE_NAME = 'currency-converter-timezone-v[^']+';/, `const TIMEZONE_CACHE_NAME = 'currency-converter-timezone-v${cacheVersion}';`);

fs.writeFileSync(swPath, swContent);
console.log(`✅ Service worker cache versions updated to v${cacheVersion}`);

// 2. Update manifest.json version
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest version updated to ${version}`);
}

console.log(`🎉 All files updated with version ${version}`);
