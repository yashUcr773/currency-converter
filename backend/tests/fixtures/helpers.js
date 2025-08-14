import User from '../../src/models/User.js';
import { validUsers } from './testData.js';

// Helper functions for creating test users and data

export const createTestUser = async (userData = validUsers.user1) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const createVerifiedUser = async (userData = validUsers.user1) => {
  const user = new User({
    ...userData,
    isEmailVerified: true
  });
  await user.save();
  return user;
};

export const createUnverifiedUser = async (userData = validUsers.unverifiedUser) => {
  const user = new User({
    ...userData,
    isEmailVerified: false
  });
  await user.save();
  return user;
};

export const createLockedUser = async (userData = validUsers.lockedUser) => {
  const user = new User({
    ...userData,
    loginAttempts: 5,
    lockUntil: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
  });
  await user.save();
  return user;
};

export const createMultipleUsers = async (count = 3) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = new User({
      email: `user${i}@example.com`,
      password: 'Password123',
      firstName: `User${i}`,
      lastName: 'Test',
      isEmailVerified: true
    });
    await user.save();
    users.push(user);
  }
  return users;
};

export const createUserWithRefreshTokens = async (userData = validUsers.user1, tokenCount = 2) => {
  const user = new User({
    ...userData,
    isEmailVerified: true
  });

  // Add mock refresh tokens
  for (let i = 0; i < tokenCount; i++) {
    user.refreshTokens.push({
      token: `refresh_token_${i}_${Date.now()}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo: `Device ${i}`,
      ipAddress: `192.168.1.${i + 1}`
    });
  }

  await user.save();
  return user;
};

export const createUserWithExpiredTokens = async (userData = validUsers.user1) => {
  const user = new User({
    ...userData,
    isEmailVerified: true
  });

  // Add expired refresh tokens
  user.refreshTokens.push({
    token: `expired_refresh_token_${Date.now()}`,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago (expired)
    deviceInfo: 'Expired Device',
    ipAddress: '192.168.1.100'
  });

  await user.save();
  return user;
};

export const cleanDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {
    'user-agent': 'Test Browser',
    ...overrides.headers
  },
  ip: '127.0.0.1',
  ...overrides
});

export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn();

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
