import express from 'express';
import User from '../models/User.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateMagicLinkToken,
  verifyToken 
} from '../utils/jwt.js';
import { generateOTP, generateSecureToken, getClientIP, sanitizeUserAgent } from '../utils/helpers.js';
import emailService from '../utils/emailService.js';
import { authRateLimit } from '../middleware/auth.js';
import { 
  validateRegistration,
  validateLogin,
  validateEmail,
  validatePasswordReset,
  validateOTPRequest,
  validateOTPLogin,
  validateMagicLinkRequest
} from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply rate limiting to auth routes
const authLimiter = authRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
const strictAuthLimiter = authRateLimit(15 * 60 * 1000, 10); // 3 attempts per 15 minutes

// REGISTER USER
router.post('/register', authLimiter, validateRegistration, asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      error: 'An account with this email already exists',
      code: 'EMAIL_EXISTS'
    });
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName
  });

  await user.save();

  // Generate email verification token
  const verificationToken = generateEmailVerificationToken(user._id);
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  // Send welcome email with verification link
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await emailService.sendWelcomeEmail(user, verificationUrl);

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    deviceInfo: sanitizeUserAgent(req.headers['user-agent']),
    ipAddress: getClientIP(req)
  });
  await user.save();

  res.status(201).json({
    message: 'Account created successfully. Please check your email to verify your account.',
    user: user.toJSON(),
    tokens: {
      accessToken,
      refreshToken
    },
    requiresEmailVerification: true
  });
}));

// LOGIN USER
router.post('/login', authLimiter, validateLogin, asyncHandler(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.status(423).json({
      error: 'Account is temporarily locked due to too many failed login attempts',
      code: 'ACCOUNT_LOCKED',
      lockUntil: user.lockUntil
    });
  }

  // Check password
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    await user.incLoginAttempts();
    return res.status(401).json({
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  const tokenExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + tokenExpiry),
    deviceInfo: sanitizeUserAgent(req.headers['user-agent']),
    ipAddress: getClientIP(req)
  });

  // Clean up expired tokens
  await user.cleanExpiredTokens();

  // Send login notification email
  const loginInfo = {
    timestamp: new Date(),
    ipAddress: getClientIP(req),
    userAgent: sanitizeUserAgent(req.headers['user-agent']),
    method: 'Password'
  };
  
  // Send notification email asynchronously (don't wait for it)
  emailService.sendLoginNotificationEmail(user, loginInfo).catch(err => 
    console.error('Failed to send login notification email:', err)
  );

  res.json({
    message: 'Login successful',
    user: user.toJSON(),
    tokens: {
      accessToken,
      refreshToken
    },
    requiresEmailVerification: !user.isEmailVerified
  });
}));

// REFRESH TOKEN
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      error: 'Refresh token required',
      code: 'NO_REFRESH_TOKEN'
    });
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User not found or inactive',
        code: 'INVALID_USER'
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenIndex = user.refreshTokens.findIndex(tokenObj => 
      tokenObj.token === refreshToken && tokenObj.expiresAt > new Date()
    );

    if (tokenIndex === -1) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    // Optionally generate new refresh token for better security
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Replace old refresh token with new one
    user.refreshTokens[tokenIndex] = {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      deviceInfo: sanitizeUserAgent(req.headers['user-agent']),
      ipAddress: getClientIP(req),
      createdAt: new Date()
    };

    await user.save();

    res.json({
      message: 'Tokens refreshed successfully',
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    res.status(401).json({
      error: 'Invalid refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
}));

// VERIFY EMAIL
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Verification token required',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_EMAIL_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({
        error: 'Invalid verification token',
        code: 'INVALID_TOKEN'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({
      message: 'Email verified successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      error: 'Invalid or expired verification token',
      code: 'INVALID_TOKEN'
    });
  }
}));

// RESEND VERIFICATION EMAIL
router.post('/resend-verification', strictAuthLimiter, validateEmail, asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      message: 'If an account with this email exists, a verification email has been sent.'
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      error: 'Email is already verified',
      code: 'ALREADY_VERIFIED'
    });
  }

  // Generate new verification token
  const verificationToken = generateEmailVerificationToken(user._id);
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await emailService.sendWelcomeEmail(user, verificationUrl);

  res.json({
    message: 'Verification email sent successfully'
  });
}));

// FORGOT PASSWORD
router.post('/forgot-password', strictAuthLimiter, validateEmail, asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      message: 'If an account with this email exists, a password reset email has been sent.'
    });
  }

  // Generate password reset token
  const resetToken = generatePasswordResetToken(user._id);
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await user.save();

  // Send password reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await emailService.sendPasswordResetEmail(user, resetUrl);

  res.json({
    message: 'Password reset email sent successfully'
  });
}));

// RESET PASSWORD
router.post('/reset-password', strictAuthLimiter, validatePasswordReset, asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = verifyToken(token, process.env.JWT_EMAIL_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user || !user.passwordResetToken || user.passwordResetExpires < new Date()) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
        code: 'INVALID_TOKEN'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    
    // Clear all refresh tokens for security
    user.refreshTokens = [];
    
    await user.save();

    res.json({
      message: 'Password reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Invalid or expired reset token',
      code: 'INVALID_TOKEN'
    });
  }
}));

// REQUEST OTP FOR LOGIN
router.post('/request-otp', strictAuthLimiter, validateOTPRequest, asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      message: 'If an account with this email exists, an OTP has been sent.'
    });
  }

  if (!user.isActive) {
    return res.json({
      message: 'If an account with this email exists, an OTP has been sent.'
    });
  }

  // Generate OTP
  const otp = generateOTP(6);
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000);
  await user.save();

  // Send OTP email
  await emailService.sendOTPEmail(user, otp);

  res.json({
    message: 'OTP sent successfully to your email address'
  });
}));

// LOGIN WITH OTP
router.post('/login-otp', authLimiter, validateOTPLogin, asyncHandler(async (req, res) => {
  const { email, otp, rememberMe = false } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.otpCode || user.otpExpires < new Date() || user.otpCode !== otp) {
    return res.status(401).json({
      error: 'Invalid or expired OTP',
      code: 'INVALID_OTP'
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      error: 'Account is deactivated',
      code: 'ACCOUNT_DEACTIVATED'
    });
  }

  // Clear OTP
  user.otpCode = null;
  user.otpExpires = null;
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  const tokenExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + tokenExpiry),
    deviceInfo: sanitizeUserAgent(req.headers['user-agent']),
    ipAddress: getClientIP(req)
  });
  await user.save();

  // Send login notification email
  const loginInfo = {
    timestamp: new Date(),
    ipAddress: getClientIP(req),
    userAgent: sanitizeUserAgent(req.headers['user-agent']),
    method: 'OTP'
  };
  
  emailService.sendLoginNotificationEmail(user, loginInfo).catch(err => 
    console.error('Failed to send login notification email:', err)
  );

  res.json({
    message: 'Login successful',
    user: user.toJSON(),
    tokens: {
      accessToken,
      refreshToken
    },
    requiresEmailVerification: !user.isEmailVerified
  });
}));

// REQUEST MAGIC LINK
router.post('/request-magic-link', strictAuthLimiter, validateMagicLinkRequest, asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  console.log("🚀 ~ user:", user)
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      message: 'If an account with this email exists, a magic link has been sent.'
    });
  }

  if (!user.isActive) {
    return res.json({
      message: 'If an account with this email exists, a magic link has been sent.'
    });
  }

  // Generate magic link token
  const magicToken = generateMagicLinkToken(user._id);
  user.magicLinkToken = magicToken;
  user.magicLinkExpires = new Date(Date.now() + (parseInt(process.env.MAGIC_LINK_EXPIRY_MINUTES) || 15) * 60 * 1000);
  await user.save();

  // Send magic link email
  const magicLinkUrl = `${process.env.FRONTEND_URL}/magic-login?token=${magicToken}`;
  await emailService.sendMagicLinkEmail(user, magicLinkUrl);

  res.json({
    message: 'Magic link sent successfully to your email address'
  });
}));

// LOGIN WITH MAGIC LINK
router.post('/magic-login', asyncHandler(async (req, res) => {
  const { token, rememberMe = false } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Magic link token required',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_EMAIL_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user || !user.magicLinkToken || user.magicLinkExpires < new Date() || user.magicLinkToken !== token) {
      return res.status(401).json({
        error: 'Invalid or expired magic link',
        code: 'INVALID_MAGIC_LINK'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Clear magic link
    user.magicLinkToken = null;
    user.magicLinkExpires = null;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    const tokenExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + tokenExpiry),
      deviceInfo: sanitizeUserAgent(req.headers['user-agent']),
      ipAddress: getClientIP(req)
    });
    await user.save();

    // Send login notification email
    const loginInfo = {
      timestamp: new Date(),
      ipAddress: getClientIP(req),
      userAgent: sanitizeUserAgent(req.headers['user-agent']),
      method: 'Magic Link'
    };
    
    emailService.sendLoginNotificationEmail(user, loginInfo).catch(err => 
      console.error('Failed to send login notification email:', err)
    );

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      },
      requiresEmailVerification: !user.isEmailVerified
    });
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired magic link',
      code: 'INVALID_MAGIC_LINK'
    });
  }
}));

// LOGOUT
router.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (refreshToken) {
    try {
      const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        // Remove the specific refresh token
        user.refreshTokens = user.refreshTokens.filter(tokenObj => 
          tokenObj.token !== refreshToken
        );
        await user.save();
      }
    } catch (error) {
      // Token might be invalid, but we still want to logout
      console.log('Error during logout:', error.message);
    }
  }

  res.json({
    message: 'Logout successful'
  });
}));

// LOGOUT ALL DEVICES
router.post('/logout-all', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (accessToken) {
    try {
      const decoded = verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        // Clear all refresh tokens
        user.refreshTokens = [];
        await user.save();
      }
    } catch (error) {
      console.log('Error during logout all:', error.message);
    }
  }

  res.json({
    message: 'Logged out from all devices successfully'
  });
}));

export default router;
