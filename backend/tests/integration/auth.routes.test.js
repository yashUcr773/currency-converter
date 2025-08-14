import request from 'supertest';
import app from '../../src/server.js';
import User from '../../src/models/User.js';
import { 
  validUsers, 
  invalidUsers, 
  loginCredentials,
  apiEndpoints,
  errorCodes,
  httpStatus
} from '../fixtures/testData.js';
import {
  createTestUser,
  createVerifiedUser,
  createUnverifiedUser,
  createLockedUser
} from '../fixtures/helpers.js';

// Mock email service to prevent actual emails
jest.mock('../../src/utils/emailService.js', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
  sendOTPEmail: jest.fn().mockResolvedValue({ success: true }),
  sendMagicLinkEmail: jest.fn().mockResolvedValue({ success: true }),
  sendLoginNotificationEmail: jest.fn().mockResolvedValue({ success: true })
}));

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.register)
        .send(validUsers.user1);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.message).toContain('Account created successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(validUsers.user1.email);
      expect(response.body.user.password).toBeUndefined(); // Should be excluded
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
      expect(response.body.requiresEmailVerification).toBe(true);

      // Verify user was created in database
      const user = await User.findOne({ email: validUsers.user1.email });
      expect(user).toBeTruthy();
      expect(user.isEmailVerified).toBe(false);
    });

    it('should not register user with existing email', async () => {
      // Create user first
      await createTestUser(validUsers.user1);

      const response = await request(app)
        .post(apiEndpoints.auth.register)
        .send(validUsers.user1);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('An account with this email already exists');
      expect(response.body.code).toBe(errorCodes.EMAIL_EXISTS);
    });

    it('should not register user with invalid email', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.register)
        .send(invalidUsers.invalidEmail);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('valid email')
          })
        ])
      );
    });

    it('should not register user with weak password', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.register)
        .send(invalidUsers.weakPassword);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password'
          })
        ])
      );
    });

    it('should not register user without required fields', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.register)
        .send(invalidUsers.noFirstName);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'firstName'
          })
        ])
      );
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createVerifiedUser(validUsers.user1);
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.login)
        .send(loginCredentials.valid);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginCredentials.valid.email);
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
      expect(response.body.requiresEmailVerification).toBe(false);
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.login)
        .send(loginCredentials.invalidPassword);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.body.error).toBe('Invalid email or password');
      expect(response.body.code).toBe(errorCodes.INVALID_CREDENTIALS);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.login)
        .send(loginCredentials.invalidEmail);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.body.error).toBe('Invalid email or password');
      expect(response.body.code).toBe(errorCodes.INVALID_CREDENTIALS);
    });

    it('should not login locked account', async () => {
      await createLockedUser(validUsers.lockedUser);

      const response = await request(app)
        .post(apiEndpoints.auth.login)
        .send({
          email: validUsers.lockedUser.email,
          password: validUsers.lockedUser.password
        });

      expect(response.status).toBe(httpStatus.LOCKED);
      expect(response.body.error).toContain('Account is temporarily locked');
      expect(response.body.code).toBe(errorCodes.ACCOUNT_LOCKED);
      expect(response.body.lockUntil).toBeDefined();
    });

    it('should login unverified user but indicate verification required', async () => {
      await createUnverifiedUser(validUsers.unverifiedUser);

      const response = await request(app)
        .post(apiEndpoints.auth.login)
        .send({
          email: validUsers.unverifiedUser.email,
          password: validUsers.unverifiedUser.password
        });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.requiresEmailVerification).toBe(true);
    });

    it('should handle remember me option', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.login)
        .send({
          ...loginCredentials.valid,
          rememberMe: true
        });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.tokens.refreshToken).toBeDefined();

      // Verify longer token expiry in database
      const user = await User.findOne({ email: loginCredentials.valid.email });
      expect(user.refreshTokens).toHaveLength(1);
      
      const tokenExpiry = user.refreshTokens[0].expiresAt;
      const now = new Date();
      const daysDifference = Math.floor((tokenExpiry - now) / (1000 * 60 * 60 * 24));
      expect(daysDifference).toBeGreaterThanOrEqual(25); // Should be close to 30 days
    });

    it('should increment login attempts on failed login', async () => {
      const user = await User.findOne({ email: validUsers.user1.email });
      expect(user.loginAttempts).toBe(0);

      await request(app)
        .post(apiEndpoints.auth.login)
        .send(loginCredentials.invalidPassword);

      const updatedUser = await User.findOne({ email: validUsers.user1.email });
      expect(updatedUser.loginAttempts).toBe(1);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let user, refreshToken;

    beforeEach(async () => {
      // Login to get refresh token
      await createVerifiedUser(validUsers.user1);
      
      const loginResponse = await request(app)
        .post(apiEndpoints.auth.login)
        .send(loginCredentials.valid);

      refreshToken = loginResponse.body.tokens.refreshToken;
      user = await User.findOne({ email: validUsers.user1.email });
    });

    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.refresh)
        .send({ refreshToken });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Tokens refreshed successfully');
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
      expect(response.body.tokens.refreshToken).not.toBe(refreshToken); // Should be new token
    });

    it('should not refresh with missing refresh token', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.refresh)
        .send({});

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.body.error).toBe('Refresh token required');
      expect(response.body.code).toBe(errorCodes.NO_REFRESH_TOKEN);
    });

    it('should not refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.refresh)
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.body.error).toBe('Invalid refresh token');
      expect(response.body.code).toBe(errorCodes.INVALID_REFRESH_TOKEN);
    });

    it('should not refresh with expired refresh token', async () => {
      // Manually set token as expired in database
      user.refreshTokens[0].expiresAt = new Date(Date.now() - 1000);
      await user.save();

      const response = await request(app)
        .post(apiEndpoints.auth.refresh)
        .send({ refreshToken });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.body.error).toBe('Invalid or expired refresh token');
      expect(response.body.code).toBe(errorCodes.INVALID_REFRESH_TOKEN);
    });
  });

  describe('POST /api/auth/verify-email', () => {
    let user, verificationToken;

    beforeEach(async () => {
      // Register user to get verification token
      const response = await request(app)
        .post(apiEndpoints.auth.register)
        .send(validUsers.user2);

      user = await User.findOne({ email: validUsers.user2.email });
      verificationToken = user.emailVerificationToken;
    });

    it('should verify email with valid token', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.verifyEmail)
        .send({ token: verificationToken });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Email verified successfully');
      expect(response.body.user.isEmailVerified).toBe(true);

      // Verify in database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isEmailVerified).toBe(true);
      expect(updatedUser.emailVerificationToken).toBeNull();
    });

    it('should not verify email with invalid token', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.verifyEmail)
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid or expired verification token');
      expect(response.body.code).toBe(errorCodes.INVALID_TOKEN);
    });

    it('should not verify already verified email', async () => {
      // First verification
      await request(app)
        .post(apiEndpoints.auth.verifyEmail)
        .send({ token: verificationToken });

      // Second verification attempt
      const response = await request(app)
        .post(apiEndpoints.auth.verifyEmail)
        .send({ token: verificationToken });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Invalid or expired verification token');
      expect(response.body.code).toBe(errorCodes.INVALID_TOKEN);
    });
  });

  describe('POST /api/auth/resend-verification', () => {
    beforeEach(async () => {
      await createUnverifiedUser(validUsers.unverifiedUser);
    });

    it('should resend verification email for unverified user', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.resendVerification)
        .send({ email: validUsers.unverifiedUser.email });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toContain('verification email has been sent');
    });

    it('should not resend for already verified user', async () => {
      // Verify the user first
      const user = await User.findOne({ email: validUsers.unverifiedUser.email });
      user.isEmailVerified = true;
      await user.save();

      const response = await request(app)
        .post(apiEndpoints.auth.resendVerification)
        .send({ email: validUsers.unverifiedUser.email });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Email is already verified');
      expect(response.body.code).toBe(errorCodes.ALREADY_VERIFIED);
    });

    it('should not reveal if email exists or not', async () => {
      const response = await request(app)
        .post(apiEndpoints.auth.resendVerification)
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toContain('verification email has been sent');
    });
  });
});

describe('Authentication Rate Limiting', () => {
  it('should apply rate limiting to auth routes', async () => {
    // This would test rate limiting by making multiple rapid requests
    // Implementation depends on your rate limiting configuration
    const promises = [];
    
    for (let i = 0; i < 20; i++) {
      promises.push(
        request(app)
          .post(apiEndpoints.auth.login)
          .send(loginCredentials.valid)
      );
    }

    const responses = await Promise.all(promises);
    const rateLimitedResponses = responses.filter(res => res.status === httpStatus.TOO_MANY_REQUESTS);
    
    // Should have at least some rate limited responses
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  }, 15000); // Longer timeout for this test
});
