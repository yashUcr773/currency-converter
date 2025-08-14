import request from 'supertest';
import app from '../../src/server.js';
import User from '../../src/models/User.js';
import { 
  validUsers, 
  loginCredentials,
  apiEndpoints,
  httpStatus
} from '../fixtures/testData.js';
import {
  createVerifiedUser,
  createUserWithRefreshTokens
} from '../fixtures/helpers.js';
import { generateAccessToken } from '../../src/utils/jwt.js';

// Mock email service
jest.mock('../../src/utils/emailService.js', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true })
}));

describe('User Routes', () => {
  let user, accessToken;

  beforeEach(async () => {
    user = await createVerifiedUser(validUsers.user1);
    accessToken = generateAccessToken(user._id);
  });

  describe('GET /api/user/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get(apiEndpoints.user.profile)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Profile retrieved successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(validUsers.user1.email);
      expect(response.body.user.firstName).toBe(validUsers.user1.firstName);
      expect(response.body.user.totalSessions).toBeDefined();
      expect(response.body.user.accountAge).toBeDefined();
      expect(response.body.user.password).toBeUndefined(); // Should be excluded
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get(apiEndpoints.user.profile);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get(apiEndpoints.user.profile)
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update user profile with valid data', async () => {
      const updateData = {
        firstName: 'UpdatedFirst',
        lastName: 'UpdatedLast',
        preferences: {
          language: 'es',
          timezone: 'America/New_York',
          currency: 'EUR',
          theme: 'dark'
        }
      };

      const response = await request(app)
        .put(apiEndpoints.user.updateProfile)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.firstName).toBe('UpdatedFirst');
      expect(response.body.user.lastName).toBe('UpdatedLast');
      expect(response.body.user.preferences.language).toBe('es');
      expect(response.body.user.preferences.timezone).toBe('America/New_York');
      expect(response.body.user.preferences.currency).toBe('EUR');
      expect(response.body.user.preferences.theme).toBe('dark');

      // Verify in database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.firstName).toBe('UpdatedFirst');
      expect(updatedUser.preferences.language).toBe('es');
    });

    it('should update partial profile data', async () => {
      const updateData = {
        firstName: 'PartialUpdate'
      };

      const response = await request(app)
        .put(apiEndpoints.user.updateProfile)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.user.firstName).toBe('PartialUpdate');
      expect(response.body.user.lastName).toBe(validUsers.user1.lastName); // Should remain unchanged
    });

    it('should not update with invalid data', async () => {
      const updateData = {
        firstName: 'a'.repeat(51), // Too long
      };

      const response = await request(app)
        .put(apiEndpoints.user.updateProfile)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should not update without authentication', async () => {
      const response = await request(app)
        .put(apiEndpoints.user.updateProfile)
        .send({ firstName: 'Test' });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /api/user/change-password', () => {
    it('should change password with valid current password', async () => {
      const passwordData = {
        currentPassword: validUsers.user1.password,
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .put(apiEndpoints.user.changePassword)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toContain('Password changed successfully');

      // Verify password was changed in database
      const updatedUser = await User.findById(user._id).select('+password');
      const isNewPasswordValid = await updatedUser.comparePassword('NewPassword123');
      expect(isNewPasswordValid).toBe(true);

      const isOldPasswordInvalid = await updatedUser.comparePassword(validUsers.user1.password);
      expect(isOldPasswordInvalid).toBe(false);
    });

    it('should not change password with incorrect current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword123'
      };

      const response = await request(app)
        .put(apiEndpoints.user.changePassword)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Current password is incorrect');
      expect(response.body.code).toBe('INVALID_CURRENT_PASSWORD');
    });

    it('should not change password to same password', async () => {
      const passwordData = {
        currentPassword: validUsers.user1.password,
        newPassword: validUsers.user1.password
      };

      const response = await request(app)
        .put(apiEndpoints.user.changePassword)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('New password must be different from current password');
      expect(response.body.code).toBe('SAME_PASSWORD');
    });

    it('should not change password with weak new password', async () => {
      const passwordData = {
        currentPassword: validUsers.user1.password,
        newPassword: 'weak'
      };

      const response = await request(app)
        .put(apiEndpoints.user.changePassword)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /api/user/sessions', () => {
    beforeEach(async () => {
      user = await createUserWithRefreshTokens(validUsers.user1, 3);
      accessToken = generateAccessToken(user._id);
    });

    it('should get active sessions', async () => {
      const response = await request(app)
        .get('/api/user/sessions')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Active sessions retrieved successfully');
      expect(response.body.sessions).toHaveLength(3);
      expect(response.body.totalSessions).toBe(3);

      // Check session structure
      expect(response.body.sessions[0]).toHaveProperty('id');
      expect(response.body.sessions[0]).toHaveProperty('createdAt');
      expect(response.body.sessions[0]).toHaveProperty('expiresAt');
      expect(response.body.sessions[0]).toHaveProperty('deviceInfo');
      expect(response.body.sessions[0]).toHaveProperty('ipAddress');
    });

    it('should not show expired sessions', async () => {
      // Make one token expired
      const updatedUser = await User.findById(user._id);
      updatedUser.refreshTokens[0].expiresAt = new Date(Date.now() - 1000);
      await updatedUser.save();

      const response = await request(app)
        .get('/api/user/sessions')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.sessions).toHaveLength(2); // Should exclude expired
      expect(response.body.totalSessions).toBe(2);
    });
  });

  describe('DELETE /api/user/sessions/:sessionId', () => {
    let sessionId;

    beforeEach(async () => {
      user = await createUserWithRefreshTokens(validUsers.user1, 2);
      accessToken = generateAccessToken(user._id);
      sessionId = user.refreshTokens[0]._id.toString();
    });

    it('should revoke specific session', async () => {
      const response = await request(app)
        .delete(`/api/user/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Session revoked successfully');

      // Verify session was removed
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.refreshTokens).toHaveLength(1);
      
      const sessionExists = updatedUser.refreshTokens.some(
        token => token._id.toString() === sessionId
      );
      expect(sessionExists).toBe(false);
    });

    it('should not revoke non-existent session', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/user/sessions/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body.error).toBe('Session not found');
      expect(response.body.code).toBe('SESSION_NOT_FOUND');
    });
  });

  describe('DELETE /api/user/sessions', () => {
    beforeEach(async () => {
      user = await createUserWithRefreshTokens(validUsers.user1, 3);
      accessToken = generateAccessToken(user._id);
    });

    it('should revoke all sessions except current', async () => {
      const response = await request(app)
        .delete('/api/user/sessions')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('All other sessions revoked successfully');

      // Verify only one session remains
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.refreshTokens).toHaveLength(1);
    });
  });

  describe('GET /api/user/stats', () => {
    it('should get account statistics', async () => {
      const response = await request(app)
        .get('/api/user/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Account statistics retrieved successfully');
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats).toHaveProperty('accountCreated');
      expect(response.body.stats).toHaveProperty('accountAge');
      expect(response.body.stats).toHaveProperty('emailVerified');
      expect(response.body.stats).toHaveProperty('accountType');
      expect(response.body.stats).toHaveProperty('preferences');
      expect(response.body.stats).toHaveProperty('loginAttempts');
      expect(response.body.stats).toHaveProperty('isLocked');
    });
  });

  describe('DELETE /api/user/account', () => {
    it('should delete account with correct credentials', async () => {
      const deleteData = {
        confirmEmail: validUsers.user1.email,
        password: validUsers.user1.password
      };

      const response = await request(app)
        .delete('/api/user/delete-account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(deleteData);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toContain('Account deleted successfully');

      // Verify account was soft deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser.isActive).toBe(false);
      expect(deletedUser.email).toContain('deleted_');
      expect(deletedUser.refreshTokens).toHaveLength(0);
    });

    it('should not delete account with wrong email confirmation', async () => {
      const deleteData = {
        confirmEmail: 'wrong@email.com',
        password: validUsers.user1.password
      };

      const response = await request(app)
        .delete('/api/user/delete-account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(deleteData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Email confirmation does not match');
      expect(response.body.code).toBe('EMAIL_MISMATCH');
    });

    it('should not delete account with wrong password', async () => {
      const deleteData = {
        confirmEmail: validUsers.user1.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .delete('/api/user/delete-account')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(deleteData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Password is incorrect');
      expect(response.body.code).toBe('INVALID_PASSWORD');
    });
  });

  describe('POST /api/user/check-password-strength', () => {
    it('should analyze password strength', async () => {
      const response = await request(app)
        .post('/api/user/check-password-strength')
        .send({ password: 'TestPassword123!' });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe('Password strength analyzed');
      expect(response.body.strength).toBeDefined();
    });

    it('should require password parameter', async () => {
      const response = await request(app)
        .post('/api/user/check-password-strength')
        .send({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error).toBe('Password is required');
      expect(response.body.code).toBe('NO_PASSWORD');
    });
  });

  describe('Authentication Requirements', () => {
    const protectedRoutes = [
      { method: 'get', path: '/api/user/profile' },
      { method: 'put', path: '/api/user/profile' },
      { method: 'put', path: '/api/user/change-password' },
      { method: 'get', path: '/api/user/sessions' },
      { method: 'delete', path: '/api/user/sessions' },
      { method: 'delete', path: '/api/user/sessions/123' },
      { method: 'get', path: '/api/user/stats' },
      { method: 'delete', path: '/api/user/delete-account' }
    ];

    protectedRoutes.forEach(route => {
      it(`should require authentication for ${route.method.toUpperCase()} ${route.path}`, async () => {
        const response = await request(app)[route.method](route.path);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    });
  });
});
