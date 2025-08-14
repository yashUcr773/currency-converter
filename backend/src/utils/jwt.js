import jsonwebtoken from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jsonwebtoken.sign(
    { userId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId) => {
  return jsonwebtoken.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

export const generateEmailVerificationToken = (userId) => {
  return jsonwebtoken.sign(
    { userId, type: 'email_verification' },
    process.env.JWT_EMAIL_SECRET,
    { expiresIn: '24h' }
  );
};

export const generatePasswordResetToken = (userId) => {
  return jsonwebtoken.sign(
    { userId, type: 'password_reset' },
    process.env.JWT_EMAIL_SECRET,
    { expiresIn: '30m' }
  );
};

export const generateMagicLinkToken = (userId) => {
  return jsonwebtoken.sign(
    { userId, type: 'magic_link' },
    process.env.JWT_EMAIL_SECRET,
    { expiresIn: '15m' }
  );
};

export const verifyToken = (token, secret) => {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

export const decodeToken = (token) => {
  return jsonwebtoken.decode(token);
};
