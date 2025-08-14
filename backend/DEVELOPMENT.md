# Development & Testing Guide

## Testing Overview

### Test Structure

```
tests/
├── unit/               # Unit tests for components
├── integration/        # API endpoint tests  
└── fixtures/           # Test data and helpers
```

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only  
npm run test:integration

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Database

Tests use MongoDB for realistic database interactions:

- **Connection**: Connects to your existing MongoDB (safer than memory server)
- **Isolation**: Cleans collections between test suites
- **Configuration**: Uses `.env.test` for test-specific settings

### Configuration Options

#### Current Setup: Babel + Jest (Recommended)

**Pros:**
- ✅ Stable and mature
- ✅ Works in all environments  
- ✅ No experimental flags needed
- ✅ Better IDE support

**Cons:**  
- ❌ Extra transformation step
- ❌ Additional dependencies

#### Alternative: Native ES Modules

Switch to native ES modules by updating package.json scripts:

```json
{
  "scripts": {
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest"
  }
}
```

**Note**: Native ES modules are experimental with Jest and may cause issues in CI/CD.

## Development Workflow

### Environment Setup

1. **Create environment file:**
   ```bash
   npm run setup  # Creates .env with secure secrets
   ```

2. **Configure database:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/auth-db
   ```

3. **Set up email service:**
   ```env  
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Development Scripts

```bash
# Start with database connection test
npm run dev

# Start server only (skip DB test)  
npm run dev:server-only

# Check MongoDB connection
npm run check-mongo

# Production server
npm start
```

### Testing Workflow

1. **Write Tests**: Add tests in appropriate directory (`unit/` or `integration/`)
2. **Run Tests**: Use `npm test` during development
3. **Check Coverage**: Run `npm run test:coverage` before commits
4. **Debug**: Use `npm run test:watch` for rapid feedback

### Code Structure

```
src/
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── validation.js     # Input validation
│   └── errorHandler.js   # Error handling
├── models/
│   └── User.js           # User schema
├── routes/
│   ├── auth.js           # Authentication endpoints
│   └── user.js           # User management endpoints
├── utils/
│   ├── jwt.js            # JWT token utilities
│   ├── emailService.js   # Email sending
│   └── helpers.js        # General utilities
└── server.js             # Express app setup
```

## Test Coverage Goals

- **Unit Tests**: 90%+ for utilities and models
- **Integration Tests**: Cover all API endpoints
- **Error Handling**: Test all error scenarios
- **Security**: Validate authentication flows

## Common Issues & Solutions

### MongoDB Memory Server Issues
**Problem**: Download timeouts, memory constraints  
**Solution**: Use real MongoDB connection (current setup)

### Jest ES Module Issues  
**Problem**: Import/export syntax errors
**Solution**: Use Babel transformation (current setup)

### Environment Variables
**Problem**: Missing or incorrect env vars
**Solution**: Run `npm run setup` to generate secure defaults

### Email Testing
**Problem**: Email service failures in tests
**Solution**: Mock email service or use test email provider

## Best Practices

1. **Write tests first** for new features
2. **Mock external services** in unit tests
3. **Use real database** for integration tests
4. **Clean up test data** after each test suite
5. **Use descriptive test names** and group related tests
6. **Test error conditions** as well as success paths

## Debugging

### Common Debug Commands

```bash
# Verbose test output
npm test -- --verbose

# Run specific test file
npm test -- tests/unit/helpers.utils.test.js

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Check MongoDB connection
npm run check-mongo
```

### VS Code Debug Configuration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```
