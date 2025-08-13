import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireEmailVerified } from '../middleware/auth.js';
import { validateProfileUpdate, validatePasswordChange } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createPasswordStrengthFeedback } from '../utils/helpers.js';

const router = express.Router();

// GET USER PROFILE
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('refreshTokens', 'createdAt deviceInfo ipAddress')
    .lean();

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Add some computed fields
  const profile = {
    ...user,
    totalSessions: user.refreshTokens ? user.refreshTokens.length : 0,
    accountAge: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)), // days
    lastLoginFormatted: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : null
  };

  res.json({
    message: 'Profile retrieved successfully',
    user: profile
  });
}));

// UPDATE USER PROFILE
router.put('/profile', authenticateToken, validateProfileUpdate, asyncHandler(async (req, res) => {
  const { firstName, lastName, preferences } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Update basic profile fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;

  // Update preferences
  if (preferences) {
    if (preferences.language) user.preferences.language = preferences.language;
    if (preferences.timezone) user.preferences.timezone = preferences.timezone;
    if (preferences.currency) user.preferences.currency = preferences.currency;
    if (preferences.numberSystem) user.preferences.numberSystem = preferences.numberSystem;
    if (preferences.theme) user.preferences.theme = preferences.theme;
  }

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: user.toJSON()
  });
}));

// CHANGE PASSWORD
router.put('/change-password', authenticateToken, validatePasswordChange, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      error: 'Current password is incorrect',
      code: 'INVALID_CURRENT_PASSWORD'
    });
  }

  // Check if new password is different from current
  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    return res.status(400).json({
      error: 'New password must be different from current password',
      code: 'SAME_PASSWORD'
    });
  }

  // Update password
  user.password = newPassword;
  
  // Clear all refresh tokens except current session for security
  const currentTokens = user.refreshTokens.filter(tokenObj => 
    tokenObj.expiresAt > new Date()
  ).slice(0, 1); // Keep only the most recent token
  user.refreshTokens = currentTokens;

  await user.save();

  res.json({
    message: 'Password changed successfully. You may need to log in again on other devices.'
  });
}));

// CHECK PASSWORD STRENGTH
router.post('/check-password-strength', asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: 'Password is required',
      code: 'NO_PASSWORD'
    });
  }

  const feedback = createPasswordStrengthFeedback(password);

  res.json({
    message: 'Password strength analyzed',
    strength: feedback
  });
}));

// GET ACTIVE SESSIONS
router.get('/sessions', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('refreshTokens');

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Filter and format active sessions
  const activeSessions = user.refreshTokens
    .filter(tokenObj => tokenObj.expiresAt > new Date())
    .map(tokenObj => ({
      id: tokenObj._id,
      createdAt: tokenObj.createdAt,
      expiresAt: tokenObj.expiresAt,
      deviceInfo: tokenObj.deviceInfo || 'Unknown Device',
      ipAddress: tokenObj.ipAddress || 'Unknown IP',
      isCurrentSession: false // We'll identify this on the frontend
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    message: 'Active sessions retrieved successfully',
    sessions: activeSessions,
    totalSessions: activeSessions.length
  });
}));

// REVOKE SESSION
router.delete('/sessions/:sessionId', authenticateToken, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Remove the specific session
  const initialLength = user.refreshTokens.length;
  user.refreshTokens = user.refreshTokens.filter(tokenObj => 
    tokenObj._id.toString() !== sessionId
  );

  if (user.refreshTokens.length === initialLength) {
    return res.status(404).json({
      error: 'Session not found',
      code: 'SESSION_NOT_FOUND'
    });
  }

  await user.save();

  res.json({
    message: 'Session revoked successfully'
  });
}));

// REVOKE ALL SESSIONS (except current)
router.delete('/sessions', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Keep only the most recent session (current)
  const currentSession = user.refreshTokens
    .filter(tokenObj => tokenObj.expiresAt > new Date())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 1);

  user.refreshTokens = currentSession;
  await user.save();

  res.json({
    message: 'All other sessions revoked successfully'
  });
}));

// DELETE ACCOUNT
router.delete('/account', authenticateToken, asyncHandler(async (req, res) => {
  const { confirmEmail, password } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Verify email confirmation
  if (confirmEmail !== user.email) {
    return res.status(400).json({
      error: 'Email confirmation does not match',
      code: 'EMAIL_MISMATCH'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      error: 'Password is incorrect',
      code: 'INVALID_PASSWORD'
    });
  }

  // Soft delete - deactivate account instead of hard delete
  user.isActive = false;
  user.email = `deleted_${user._id}@trip-tools.deleted`;
  user.refreshTokens = [];
  user.emailVerificationToken = null;
  user.passwordResetToken = null;
  user.magicLinkToken = null;
  user.otpCode = null;
  
  await user.save();

  res.json({
    message: 'Account deleted successfully. We\'re sorry to see you go!'
  });
}));

// GET ACCOUNT STATS
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  const stats = {
    accountCreated: user.createdAt,
    accountAge: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)), // days
    lastLogin: user.lastLogin,
    lastActivity: user.lastActivity,
    totalSessions: user.refreshTokens.filter(t => t.expiresAt > new Date()).length,
    emailVerified: user.isEmailVerified,
    accountType: user.accountType,
    isActive: user.isActive,
    preferences: user.preferences,
    loginAttempts: user.loginAttempts || 0,
    isLocked: user.isLocked || false
  };

  res.json({
    message: 'Account statistics retrieved successfully',
    stats
  });
}));

// UPDATE EMAIL (requires verification)
router.put('/email', authenticateToken, requireEmailVerified, asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      error: 'Password is incorrect',
      code: 'INVALID_PASSWORD'
    });
  }

  // Check if new email already exists
  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) {
    return res.status(400).json({
      error: 'An account with this email already exists',
      code: 'EMAIL_EXISTS'
    });
  }

  // Update email and reset verification status
  user.email = newEmail;
  user.isEmailVerified = false;
  
  // Generate new verification token
  const { generateEmailVerificationToken } = await import('../utils/jwt.js');
  const verificationToken = generateEmailVerificationToken(user._id);
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await user.save();

  // Send verification email to new email address
  const emailService = (await import('../utils/emailService.js')).default;
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await emailService.sendWelcomeEmail(user, verificationUrl);

  res.json({
    message: 'Email updated successfully. Please check your new email address for verification.',
    user: user.toJSON(),
    requiresEmailVerification: true
  });
}));

export default router;
