# Trip Tools Backend API

A comprehensive Node.js backend for the Trip Tools application with complete authentication workflows including email verification, password reset, OTP login, and magic link authentication.

## Features

### 🔐 Authentication & Security
- **User Registration** with email verification
- **Email/Password Login** with account lockout protection
- **OTP Login** via email (6-digit codes)
- **Magic Link Login** (passwordless authentication)
- **Password Reset** with secure token-based flow
- **JWT Token Management** (Access + Refresh tokens)
- **Session Management** (view and revoke active sessions)
- **Rate Limiting** on sensitive endpoints
- **Account Security** (failed login attempt tracking)

### 👤 User Management
- **Profile Management** (name, preferences, timezone, currency)
- **Password Management** (change password with strength checking)
- **Email Management** (update email with verification)
- **Account Statistics** and activity tracking
- **Multi-device Session Management**
- **Account Deactivation** (soft delete)

### 📧 Email Communications
- **Welcome Emails** with verification links
- **Password Reset Emails** with secure links
- **OTP Delivery** via email
- **Magic Link Delivery** for passwordless login
- **Login Notifications** for security awareness
- **Professional Email Templates** with responsive design

### 🛡️ Security Features
- **Password Hashing** with bcrypt (cost factor 12)
- **JWT Token Security** with separate secrets for different token types
- **Input Validation** with express-validator
- **Rate Limiting** with IP-based tracking
- **Account Lockout** after failed attempts
- **Secure Headers** with Helmet
- **CORS Configuration** for frontend integration

### 🏗️ Architecture
- **MongoDB** with Mongoose ODM
- **RESTful API** design
- **Modular Structure** with clear separation of concerns
- **Error Handling** with comprehensive error responses
- **Logging** and monitoring ready
- **Environment-based Configuration**

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+
- Gmail account (or other SMTP service) for email functionality

### Installation

1. **Clone and navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
npm run setup  # Creates .env with secure JWT secrets
```

4. **Configure MongoDB connection in .env:**

**Option A: MongoDB Atlas (Recommended - Free)**
```env
# Sign up at https://cloud.mongodb.com and create a free cluster
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trip-tools?retryWrites=true&w=majority
```

**Option B: Local MongoDB**
```env
# Install MongoDB locally and use default connection
MONGODB_URI=mongodb://localhost:27017/trip-tools
```

**Option C: Hosted MongoDB**
```env
# Use any hosted MongoDB service
MONGODB_URI=mongodb://username:password@host:port/database
```

5. **Configure email settings in .env:**
```env
# For Gmail (after enabling 2FA and generating app password):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

6. **Start the development server:**
```bash
npm run dev  # Tests MongoDB connection and starts server
```

The API will be available at `http://localhost:3001`

### Production Deployment

1. **Set production environment:**
```bash
export NODE_ENV=production
```

2. **Use strong JWT secrets:**
```bash
# Generate strong secrets
openssl rand -base64 64
```

3. **Configure production database:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trip-tools
```

4. **Set up email service** (Gmail, SendGrid, etc.)

5. **Start the server:**
```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user account |
| POST | `/login` | Login with email/password |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Logout from current session |
| POST | `/logout-all` | Logout from all sessions |
| POST | `/verify-email` | Verify email address |
| POST | `/resend-verification` | Resend verification email |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password with token |
| POST | `/request-otp` | Request OTP for login |
| POST | `/login-otp` | Login with OTP code |
| POST | `/request-magic-link` | Request magic login link |
| POST | `/magic-login` | Login with magic link |

### User Routes (`/api/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update user profile |
| PUT | `/change-password` | Change password |
| POST | `/check-password-strength` | Check password strength |
| GET | `/sessions` | Get active sessions |
| DELETE | `/sessions/:id` | Revoke specific session |
| DELETE | `/sessions` | Revoke all other sessions |
| GET | `/stats` | Get account statistics |
| PUT | `/email` | Update email address |
| DELETE | `/account` | Delete account (soft delete) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check endpoint |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "message": "Account created successfully. Please check your email to verify your account.",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false,
    "preferences": {...}
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  },
  "requiresEmailVerification": true
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

### Request Magic Link
```bash
POST /api/auth/request-magic-link
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Protected Route (with Authorization header)
```bash
GET /api/user/profile
Authorization: Bearer <access_token>
```

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `SMTP_PASS`

### Other Email Services
The system supports any SMTP service. Update the SMTP configuration:

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

## Security Considerations

### JWT Tokens
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7-30 days), used to generate new access tokens
- **Email Tokens**: Used for email verification, password reset (30 minutes - 24 hours)

### Rate Limiting
- **General**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 attempts per 15 minutes per IP
- **Sensitive operations**: 3 attempts per 15 minutes per IP

### Password Security
- Minimum 6 characters (validation enforces stronger passwords)
- Hashed with bcrypt (cost factor 12)
- Password strength feedback available

### Account Protection
- Account lockout after 5 failed login attempts (2 hours)
- Login notification emails
- Session management and revocation
- Secure token generation for all operations

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed),
  firstName: String (required),
  lastName: String (required),
  isEmailVerified: Boolean (default: false),
  
  // Security fields
  emailVerificationToken: String,
  passwordResetToken: String,
  loginAttempts: Number,
  lockUntil: Date,
  
  // Login methods
  otpCode: String,
  otpExpires: Date,
  magicLinkToken: String,
  magicLinkExpires: Date,
  
  // Session management
  refreshTokens: [RefreshTokenSchema],
  
  // User preferences
  preferences: {
    language: String (default: 'en'),
    timezone: String (default: 'UTC'),
    currency: String (default: 'USD'),
    numberSystem: String (default: 'western'),
    theme: String (default: 'system')
  },
  
  // Activity tracking
  lastLogin: Date,
  lastActivity: Date,
  isActive: Boolean (default: true),
  accountType: String (default: 'free'),
  
  timestamps: true
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [/* validation errors if applicable */]
}
```

Common error codes:
- `EMAIL_EXISTS` - Email already registered
- `INVALID_CREDENTIALS` - Wrong email/password
- `ACCOUNT_LOCKED` - Too many failed attempts
- `TOKEN_EXPIRED` - JWT token expired
- `EMAIL_NOT_VERIFIED` - Email verification required
- `RATE_LIMITED` - Too many requests

## Development

### Available Scripts
```bash
npm run setup        # Initial environment setup with secure JWT secrets
npm run dev          # Test MongoDB connection and start development server
npm run dev:server-only  # Start only the API server (skip MongoDB test)
npm run start        # Start production server
npm run check-mongo  # Check MongoDB connection status
npm test             # Run tests (when implemented)
```

### Project Structure
```
backend/
├── src/
│   ├── middleware/     # Authentication, validation, error handling
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API route handlers
│   ├── utils/          # Utilities (JWT, email, helpers)
│   └── server.js       # Express app setup
├── package.json
├── .env.example
└── README.md
```

## Testing

The backend includes comprehensive error handling and validation. You can test the API using:

### Curl Examples
```bash
# Health check
curl http://localhost:3001/api/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

### Postman Collection
Consider creating a Postman collection with all endpoints for easier testing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@trip-tools.com
- Documentation: [API Documentation](https://api-docs.trip-tools.com)

## Changelog

### v1.0.0 (Current)
- Initial backend implementation
- Complete authentication system
- Email verification workflows
- Password reset functionality
- OTP and Magic Link authentication
- User profile management
- Session management
- MongoDB integration
- Email service integration
- Security features and rate limiting
