// Test fixtures for consistent test data

export const validUsers = {
  user1: {
    email: 'test1@example.com',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe'
  },
  user2: {
    email: 'test2@example.com',
    password: 'Password456',
    firstName: 'Jane',
    lastName: 'Smith'
  },
  unverifiedUser: {
    email: 'unverified@example.com',
    password: 'Password789',
    firstName: 'Unverified',
    lastName: 'User',
    isEmailVerified: false
  },
  lockedUser: {
    email: 'locked@example.com',
    password: 'Password101',
    firstName: 'Locked',
    lastName: 'User',
    loginAttempts: 5,
    lockUntil: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
  }
};

export const invalidUsers = {
  noEmail: {
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe'
  },
  invalidEmail: {
    email: 'invalid-email',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe'
  },
  shortPassword: {
    email: 'test@example.com',
    password: '123',
    firstName: 'John',
    lastName: 'Doe'
  },
  weakPassword: {
    email: 'test@example.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe'
  },
  noFirstName: {
    email: 'test@example.com',
    password: 'Password123',
    lastName: 'Doe'
  },
  noLastName: {
    email: 'test@example.com',
    password: 'Password123',
    firstName: 'John'
  },
  longFirstName: {
    email: 'test@example.com',
    password: 'Password123',
    firstName: 'a'.repeat(51),
    lastName: 'Doe'
  }
};

export const loginCredentials = {
  valid: {
    email: 'test1@example.com',
    password: 'Password123'
  },
  invalidPassword: {
    email: 'test1@example.com',
    password: 'wrongpassword'
  },
  invalidEmail: {
    email: 'nonexistent@example.com',
    password: 'Password123'
  },
  missingPassword: {
    email: 'test1@example.com'
  },
  missingEmail: {
    password: 'Password123'
  }
};

export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
  MAGIC_LINK: 'magic_link'
};

export const mockJWTPayloads = {
  validUser: {
    userId: '507f1f77bcf86cd799439011',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  },
  expiredToken: {
    userId: '507f1f77bcf86cd799439011',
    iat: Math.floor(Date.now() / 1000) - (60 * 60 * 2), // 2 hours ago
    exp: Math.floor(Date.now() / 1000) - (60 * 60) // 1 hour ago (expired)
  }
};

export const apiEndpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    verifyEmail: '/api/auth/verify-email',
    resendVerification: '/api/auth/resend-verification',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    logout: '/api/auth/logout',
    logoutAll: '/api/auth/logout-all',
    requestOTP: '/api/auth/request-otp',
    verifyOTP: '/api/auth/verify-otp',
    requestMagicLink: '/api/auth/request-magic-link',
    verifyMagicLink: '/api/auth/verify-magic-link'
  },
  user: {
    profile: '/api/user/profile',
    updateProfile: '/api/user/profile',
    changePassword: '/api/user/change-password',
    deleteAccount: '/api/user/delete-account'
  },
  health: '/api/health'
};

export const errorCodes = {
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  NO_REFRESH_TOKEN: 'NO_REFRESH_TOKEN',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  INVALID_USER: 'INVALID_USER',
  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED'
};

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  LOCKED: 423,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};
