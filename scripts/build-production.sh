#!/bin/bash

# Production Build Script for Trip Tools
# This script prepares and builds the application for production deployment

set -e  # Exit on any error

echo "🚀 Starting production build for Trip Tools..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is not supported. Please use Node.js 18+."
    exit 1
fi

print_success "Node.js version: $NODE_VERSION"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci
print_success "Dependencies installed successfully"

# Run security audit
print_status "Running security audit..."
npm audit --audit-level moderate
if [ $? -ne 0 ]; then
    print_warning "Security vulnerabilities found. Please review and fix before deploying to production."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
print_success "Security audit completed"

# Run TypeScript type checking
print_status "Running TypeScript type checking..."
npm run type-check
print_success "TypeScript type checking passed"

# Run linting
print_status "Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    print_error "Linting failed. Please fix the issues and try again."
    exit 1
fi
print_success "Linting passed"

# Clean previous build
print_status "Cleaning previous build..."
npm run clean
print_success "Previous build cleaned"

# Set production environment
export NODE_ENV=production

# Build the project
print_status "Building for production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the error messages above."
    exit 1
fi
print_success "Production build completed"

# Check if build directory exists and has content
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    print_error "Build directory is empty or doesn't exist"
    exit 1
fi

# Get build size information
BUILD_SIZE=$(du -sh dist | cut -f1)
print_success "Build size: $BUILD_SIZE"

# Count files in build
FILE_COUNT=$(find dist -type f | wc -l)
print_success "Total files: $FILE_COUNT"

# Check for critical files
CRITICAL_FILES=("index.html" "manifest.json" "sw.js")
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "dist/$file" ]; then
        print_error "Critical file missing: $file"
        exit 1
    fi
done
print_success "All critical files present"

# Optional: Run bundle analyzer
if command -v vite-bundle-analyzer &> /dev/null; then
    read -p "Run bundle analyzer? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Running bundle analyzer..."
        npm run build:analyze
    fi
fi

# Final success message
echo
print_success "🎉 Production build completed successfully!"
echo
echo "Next steps:"
echo "  1. Test the build: npm run preview"
echo "  2. Deploy to production: vercel --prod"
echo "  3. Monitor health: Check /health.html after deployment"
echo
echo "Build output is in the 'dist' directory"
echo "Build size: $BUILD_SIZE"
echo "Total files: $FILE_COUNT"
