import crypto from 'crypto';

export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return otp;
};

export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashString = (str, algorithm = 'sha256') => {
  return crypto.createHash(algorithm).update(str).digest('hex');
};

export const generateRandomString = (length = 16) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const createPasswordStrengthFeedback = (password) => {
  const feedback = {
    score: 0,
    strength: 'Very Weak',
    suggestions: [],
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[@$!%*?&]/.test(password),
    isCommon: false
  };

  // Common passwords to check against
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];

  feedback.isCommon = commonPasswords.some(common => 
    password.toLowerCase().includes(common.toLowerCase())
  );

  // Calculate score based on criteria
  if (feedback.hasMinLength) feedback.score += 1;
  if (feedback.hasUppercase) feedback.score += 1;
  if (feedback.hasLowercase) feedback.score += 1;
  if (feedback.hasNumbers) feedback.score += 1;
  if (feedback.hasSpecialChars) feedback.score += 1;
  if (password.length >= 12) feedback.score += 1;
  if (feedback.isCommon) feedback.score -= 2;

  // Ensure score doesn't go below 0
  feedback.score = Math.max(0, feedback.score);

  // Determine strength level
  if (feedback.score <= 2) {
    feedback.strength = 'Very Weak';
  } else if (feedback.score === 3) {
    feedback.strength = 'Weak';
  } else if (feedback.score === 4) {
    feedback.strength = 'Fair';
  } else if (feedback.score === 5) {
    feedback.strength = 'Good';
  } else {
    feedback.strength = 'Strong';
  }

  // Generate suggestions
  if (!feedback.hasMinLength) {
    feedback.suggestions.push('Use at least 8 characters');
  }
  if (!feedback.hasUppercase) {
    feedback.suggestions.push('Include uppercase letters (A-Z)');
  }
  if (!feedback.hasLowercase) {
    feedback.suggestions.push('Include lowercase letters (a-z)');
  }
  if (!feedback.hasNumbers) {
    feedback.suggestions.push('Include numbers (0-9)');
  }
  if (!feedback.hasSpecialChars) {
    feedback.suggestions.push('Include special characters (@$!%*?&)');
  }
  if (password.length < 12) {
    feedback.suggestions.push('Consider using 12+ characters for better security');
  }
  if (feedback.isCommon) {
    feedback.suggestions.push('Avoid common passwords');
  }

  return feedback;
};

export const sanitizeUserAgent = (userAgent) => {
  if (!userAgent) return 'Unknown';
  return userAgent.substring(0, 200); // Limit length to prevent abuse
};

export const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'unknown';
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
