import User from '../../src/models/User.js';
import { validUsers, invalidUsers } from '../fixtures/testData.js';
import mongoose from 'mongoose';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = validUsers.user1;
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.isEmailVerified).toBe(false);
      expect(savedUser.isActive).toBe(true);
      expect(savedUser.accountType).toBe('free');
      expect(savedUser.preferences.language).toBe('en');
      expect(savedUser.preferences.currency).toBe('USD');
      expect(savedUser.preferences.theme).toBe('system');
    });

    it('should hash password before saving', async () => {
      const userData = validUsers.user1;
      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[aby]?\$[\d]+\$/); // bcrypt hash pattern
    });

    it('should not rehash password if not modified', async () => {
      const user = new User(validUsers.user1);
      await user.save();
      const originalHash = user.password;

      user.firstName = 'Updated Name';
      await user.save();

      expect(user.password).toBe(originalHash);
    });

    it('should enforce unique email constraint', async () => {
      await new User(validUsers.user1).save();

      const duplicateUser = new User(validUsers.user1);
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const user = new User(invalidUsers.invalidEmail);
      await expect(user.save()).rejects.toThrow();
    });

    it('should require email', async () => {
      const user = new User(invalidUsers.noEmail);
      await expect(user.save()).rejects.toThrow();
    });

    it('should require firstName', async () => {
      const user = new User(invalidUsers.noFirstName);
      await expect(user.save()).rejects.toThrow();
    });

    it('should require lastName', async () => {
      const user = new User(invalidUsers.noLastName);
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce firstName max length', async () => {
      const user = new User(invalidUsers.longFirstName);
      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Virtual Properties', () => {
    it('should generate fullName virtual', async () => {
      const user = new User(validUsers.user1);
      expect(user.fullName).toBe(`${validUsers.user1.firstName} ${validUsers.user1.lastName}`);
    });

    it('should calculate isLocked virtual correctly', async () => {
      const user = new User(validUsers.user1);
      expect(user.isLocked).toBe(false);

      user.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      expect(user.isLocked).toBe(true);

      user.lockUntil = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      expect(user.isLocked).toBe(false);
    });
  });

  describe('Instance Methods', () => {
    let user;

    beforeEach(async () => {
      user = new User(validUsers.user1);
      await user.save();
    });

    describe('comparePassword', () => {
      it('should return true for correct password', async () => {
        const isValid = await user.comparePassword(validUsers.user1.password);
        expect(isValid).toBe(true);
      });

      it('should return false for incorrect password', async () => {
        const isValid = await user.comparePassword('wrongpassword');
        expect(isValid).toBe(false);
      });

      it('should return false if no password set', async () => {
        user.password = null;
        const isValid = await user.comparePassword('anypassword');
        expect(isValid).toBe(false);
      });
    });

    describe('incLoginAttempts', () => {
      it('should increment login attempts', async () => {
        expect(user.loginAttempts).toBe(0);
        
        await user.incLoginAttempts();
        const updatedUser = await User.findById(user._id);
        
        expect(updatedUser.loginAttempts).toBe(1);
      });

      it('should lock account after max attempts', async () => {
        // Set to 4 attempts (one less than max)
        user.loginAttempts = 4;
        await user.save();

        await user.incLoginAttempts();
        const updatedUser = await User.findById(user._id);

        expect(updatedUser.loginAttempts).toBe(5);
        expect(updatedUser.lockUntil).toBeDefined();
        expect(updatedUser.isLocked).toBe(true);
      });

      it('should reset attempts if previous lock expired', async () => {
        user.loginAttempts = 3;
        user.lockUntil = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago (expired)
        await user.save();

        await user.incLoginAttempts();
        const updatedUser = await User.findById(user._id);

        expect(updatedUser.loginAttempts).toBe(1);
        expect(updatedUser.lockUntil).toBeFalsy(); // Could be null or undefined
      });
    });

    describe('resetLoginAttempts', () => {
      it('should reset login attempts and lock', async () => {
        user.loginAttempts = 3;
        user.lockUntil = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        await user.resetLoginAttempts();
        const updatedUser = await User.findById(user._id);

        expect(updatedUser.loginAttempts).toBe(0); // Default value after $unset
        expect(updatedUser.lockUntil).toBeFalsy(); // Could be null or undefined after $unset
      });
    });

    describe('cleanExpiredTokens', () => {
      it('should remove expired refresh tokens', async () => {
        // Add valid and expired tokens
        user.refreshTokens = [
          {
            token: 'valid_token',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
            deviceInfo: 'Valid Device',
            ipAddress: '192.168.1.1'
          },
          {
            token: 'expired_token',
            expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            deviceInfo: 'Expired Device',
            ipAddress: '192.168.1.2'
          }
        ];
        await user.save();

        await user.cleanExpiredTokens();

        expect(user.refreshTokens).toHaveLength(1);
        expect(user.refreshTokens[0].token).toBe('valid_token');
      });

      it('should keep all tokens if none expired', async () => {
        user.refreshTokens = [
          {
            token: 'token1',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            deviceInfo: 'Device 1',
            ipAddress: '192.168.1.1'
          },
          {
            token: 'token2',
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            deviceInfo: 'Device 2',
            ipAddress: '192.168.1.2'
          }
        ];
        await user.save();

        await user.cleanExpiredTokens();

        expect(user.refreshTokens).toHaveLength(2);
      });
    });
  });

  describe('JSON Transformation', () => {
    it('should exclude sensitive fields in toJSON', async () => {
      const user = new User({
        ...validUsers.user1,
        emailVerificationToken: 'sensitive_token',
        passwordResetToken: 'reset_token'
      });
      await user.save();

      const userJson = user.toJSON();

      expect(userJson.password).toBeUndefined();
      expect(userJson.emailVerificationToken).toBeUndefined();
      expect(userJson.passwordResetToken).toBeUndefined();
      expect(userJson.refreshTokens).toBeUndefined();
      expect(userJson.magicLinkToken).toBeUndefined();
      expect(userJson.otpCode).toBeUndefined();
      expect(userJson.__v).toBeUndefined();

      // Should include non-sensitive fields
      expect(userJson.email).toBe(validUsers.user1.email);
      expect(userJson.firstName).toBe(validUsers.user1.firstName);
      expect(userJson.lastName).toBe(validUsers.user1.lastName);
      expect(userJson._id).toBeDefined();
      expect(userJson.createdAt).toBeDefined();
      expect(userJson.updatedAt).toBeDefined();
    });
  });

  describe('Database Indexes', () => {
    it('should have proper indexes', async () => {
      const indexes = await User.collection.getIndexes();
      
      // Check for email index (unique)
      expect(indexes).toHaveProperty('email_1');
      
      // Check for token indexes
      expect(indexes).toHaveProperty('emailVerificationToken_1');
      expect(indexes).toHaveProperty('passwordResetToken_1');
      expect(indexes).toHaveProperty('magicLinkToken_1');
      expect(indexes).toHaveProperty('createdAt_-1');
    });
  });

  describe('Schema Validation', () => {
    it('should validate preferences.numberSystem enum', async () => {
      const user = new User({
        ...validUsers.user1,
        preferences: {
          numberSystem: 'invalid_system'
        }
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should validate preferences.theme enum', async () => {
      const user = new User({
        ...validUsers.user1,
        preferences: {
          theme: 'invalid_theme'
        }
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should validate accountType enum', async () => {
      const user = new User({
        ...validUsers.user1,
        accountType: 'invalid_type'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should allow valid enum values', async () => {
      const user = new User({
        ...validUsers.user1,
        preferences: {
          numberSystem: 'arabic',
          theme: 'dark'
        },
        accountType: 'premium'
      });

      await expect(user.save()).resolves.toBeDefined();
    });
  });
});
