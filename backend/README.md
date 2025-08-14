# Authentication API Backend

> ⚠️ **Note**: This backend appears to be unrelated to the main currency converter project. Consider moving to a separate repository.

A Node.js authentication API with user management, email verification, and session handling.

## Quick Overview

- **Purpose**: User authentication and management system
- **Stack**: Node.js + Express + MongoDB + JWT
- **Features**: Registration, login, password reset, email verification, OTP authentication

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
npm run setup

# 3. Configure MongoDB in .env
MONGODB_URI=mongodb://localhost:27017/auth-db

# 4. Start development server
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### User Management  
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/change-password` - Change password
- `GET /api/user/sessions` - Get active sessions
- `DELETE /api/user/sessions/:id` - Revoke session
## Development

```bash
# Available scripts
npm start        # Production server
npm run dev      # Development with auto-reload
npm test         # Run tests
npm run setup    # Initialize environment
```

## Project Structure

```
src/
├── middleware/     # Auth, validation, error handling
├── models/         # MongoDB schemas (User)  
├── routes/         # API routes (auth, user)
├── utils/          # JWT, email, helpers
└── server.js       # Express app setup
```

## Environment Variables

Create `.env` file with:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auth-db
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## License

MIT License
