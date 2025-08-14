#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Trip Tools Backend...\n');

// Function to generate secure random string
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('base64');
};

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to regenerate it, please delete the existing .env file first.\n');
  process.exit(0);
}

// Copy .env.example to .env and replace secrets
const envExamplePath = path.join(__dirname, '.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ .env.example file not found!');
  process.exit(1);
}

let envContent = fs.readFileSync(envExamplePath, 'utf8');

// Replace placeholder secrets with real ones
const secrets = {
  'your-super-secret-jwt-access-key-change-this-in-production': generateSecret(32),
  'your-super-secret-jwt-refresh-key-change-this-in-production': generateSecret(32),
  'your-super-secret-jwt-email-verification-key-change-this-in-production': generateSecret(32)
};

for (const [placeholder, secret] of Object.entries(secrets)) {
  envContent = envContent.replace(placeholder, secret);
}

// Write the .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file created successfully!');
console.log('🔑 JWT secrets have been automatically generated\n');

console.log('📋 Next steps:');
console.log('1. Update your MongoDB URI in .env if needed');
console.log('2. Configure email settings (SMTP_HOST, SMTP_USER, SMTP_PASS)');
console.log('3. Set your frontend URL in FRONTEND_URL');
console.log('4. Run: npm install');
console.log('5. Run: npm run dev\n');

console.log('📧 For Gmail setup:');
console.log('1. Enable 2-Factor Authentication');
console.log('2. Generate an App Password in Google Account Settings');
console.log('3. Use the app password as SMTP_PASS in .env\n');

console.log('🔗 API will be available at: http://localhost:0');
console.log('📊 Health check: http://localhost:3000/api/health\n');

console.log('Happy coding! 🎉');
