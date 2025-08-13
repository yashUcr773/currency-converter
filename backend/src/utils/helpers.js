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
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return result;
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

export const sanitizeUserAgent = (userAgent) => {
  if (!userAgent) return 'Unknown';
  return userAgent.substring(0, 200); // Limit length to prevent abuse
};

export const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
};

export const formatDateForEmail = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  }).format(new Date(date));
};

export const validateTimezone = (timezone) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

export const validateCurrency = (currency) => {
  // Basic validation for 3-letter currency codes
  return /^[A-Z]{3}$/.test(currency);
};

export const validateLanguageCode = (lang) => {
  // Basic validation for language codes (2-5 characters)
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(lang);
};

export const createPasswordStrengthFeedback = (password) => {
  const feedback = {
    score: 0,
    suggestions: []
  };

  if (password.length < 8) {
    feedback.suggestions.push('Use at least 8 characters');
  } else {
    feedback.score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.suggestions.push('Include lowercase letters');
  } else {
    feedback.score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.suggestions.push('Include uppercase letters');
  } else {
    feedback.score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.suggestions.push('Include numbers');
  } else {
    feedback.score += 1;
  }

  if (!/[@$!%*?&]/.test(password)) {
    feedback.suggestions.push('Include special characters (@$!%*?&)');
  } else {
    feedback.score += 1;
  }

  if (password.length >= 12) {
    feedback.score += 1;
  }

  const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  feedback.strength = strength[Math.min(feedback.score, 5)];

  return feedback;
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
