import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateMagicLinkToken,
  verifyToken,
  decodeToken
} from '../../src/utils/jwt.js';
import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
  const testUserId = '507f1f77bcf86cd799439011';

  describe('Token Generation', () => {
    describe('generateAccessToken', () => {
      it('should generate a valid access token', () => {
        const token = generateAccessToken(testUserId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = jwt.decode(token);
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('access');
        expect(decoded.exp).toBeDefined();
        expect(decoded.iat).toBeDefined();
      });

      it('should generate tokens with 15 minute expiration', () => {
        const token = generateAccessToken(testUserId);
        const decoded = jwt.decode(token);
        const expirationTime = decoded.exp - decoded.iat;
        
        expect(expirationTime).toBe(15 * 60); // 15 minutes in seconds
      });
    });

    describe('generateRefreshToken', () => {
      it('should generate a valid refresh token', () => {
        const token = generateRefreshToken(testUserId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = jwt.decode(token);
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('refresh');
      });

      it('should generate tokens with 7 day expiration', () => {
        const token = generateRefreshToken(testUserId);
        const decoded = jwt.decode(token);
        const expirationTime = decoded.exp - decoded.iat;
        
        expect(expirationTime).toBe(7 * 24 * 60 * 60); // 7 days in seconds
      });
    });

    describe('generateEmailVerificationToken', () => {
      it('should generate a valid email verification token', () => {
        const token = generateEmailVerificationToken(testUserId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = jwt.decode(token);
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('email_verification');
      });

      it('should generate tokens with 24 hour expiration', () => {
        const token = generateEmailVerificationToken(testUserId);
        const decoded = jwt.decode(token);
        const expirationTime = decoded.exp - decoded.iat;
        
        expect(expirationTime).toBe(24 * 60 * 60); // 24 hours in seconds
      });
    });

    describe('generatePasswordResetToken', () => {
      it('should generate a valid password reset token', () => {
        const token = generatePasswordResetToken(testUserId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = jwt.decode(token);
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('password_reset');
      });

      it('should generate tokens with 30 minute expiration', () => {
        const token = generatePasswordResetToken(testUserId);
        const decoded = jwt.decode(token);
        const expirationTime = decoded.exp - decoded.iat;
        
        expect(expirationTime).toBe(30 * 60); // 30 minutes in seconds
      });
    });

    describe('generateMagicLinkToken', () => {
      it('should generate a valid magic link token', () => {
        const token = generateMagicLinkToken(testUserId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = jwt.decode(token);
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('magic_link');
      });

      it('should generate tokens with 15 minute expiration', () => {
        const token = generateMagicLinkToken(testUserId);
        const decoded = jwt.decode(token);
        const expirationTime = decoded.exp - decoded.iat;
        
        expect(expirationTime).toBe(15 * 60); // 15 minutes in seconds
      });
    });
  });

  describe('Token Verification', () => {
    describe('verifyToken', () => {
      it('should verify a valid access token', () => {
        const token = generateAccessToken(testUserId);
        const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
        
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('access');
      });

      it('should verify a valid refresh token', () => {
        const token = generateRefreshToken(testUserId);
        const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
        
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('refresh');
      });

      it('should verify a valid email verification token', () => {
        const token = generateEmailVerificationToken(testUserId);
        const decoded = verifyToken(token, process.env.JWT_EMAIL_SECRET);
        
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('email_verification');
      });

      it('should throw error for invalid token', () => {
        const invalidToken = 'invalid.token.here';
        
        expect(() => {
          verifyToken(invalidToken, process.env.JWT_ACCESS_SECRET);
        }).toThrow();
      });

      it('should throw error for wrong secret', () => {
        const token = generateAccessToken(testUserId);
        
        expect(() => {
          verifyToken(token, 'wrong-secret');
        }).toThrow();
      });

      it('should throw error for expired token', () => {
        // Create an expired token
        const expiredToken = jwt.sign(
          { userId: testUserId, type: 'access' },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '-1h' } // Already expired
        );
        
        expect(() => {
          verifyToken(expiredToken, process.env.JWT_ACCESS_SECRET);
        }).toThrow();
      });

      it('should throw error for token with different secret', () => {
        const accessToken = generateAccessToken(testUserId);
        
        expect(() => {
          verifyToken(accessToken, process.env.JWT_REFRESH_SECRET);
        }).toThrow();
      });
    });
  });

  describe('Token Decoding', () => {
    describe('decodeToken', () => {
      it('should decode a token without verification', () => {
        const token = generateAccessToken(testUserId);
        const decoded = decodeToken(token);
        
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('access');
        expect(decoded.exp).toBeDefined();
        expect(decoded.iat).toBeDefined();
      });

      it('should decode an invalid token without throwing', () => {
        const invalidToken = 'invalid.token.here';
        const decoded = decodeToken(invalidToken);
        
        expect(decoded).toBeNull();
      });

      it('should decode an expired token', () => {
        const expiredToken = jwt.sign(
          { userId: testUserId, type: 'access' },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '-1h' }
        );
        
        const decoded = decodeToken(expiredToken);
        expect(decoded.userId).toBe(testUserId);
        expect(decoded.type).toBe('access');
      });
    });
  });

  describe('Token Security', () => {
    it('should generate different tokens for same user', async () => {
      const token1 = generateAccessToken(testUserId);
      
      // Wait a moment to ensure different iat (issued at) timestamp
      await new Promise(resolve => setTimeout(resolve, 1001));
      const token2 = generateAccessToken(testUserId);
      
      expect(token1).not.toBe(token2);
    });

    it('should generate different types of tokens with different secrets', () => {
      const accessToken = generateAccessToken(testUserId);
      const refreshToken = generateRefreshToken(testUserId);
      const emailToken = generateEmailVerificationToken(testUserId);
      
      // These should not be verifiable with wrong secrets
      expect(() => verifyToken(accessToken, process.env.JWT_REFRESH_SECRET)).toThrow();
      expect(() => verifyToken(refreshToken, process.env.JWT_ACCESS_SECRET)).toThrow();
      expect(() => verifyToken(emailToken, process.env.JWT_ACCESS_SECRET)).toThrow();
    });

    it('should include timestamp in tokens for uniqueness', () => {
      const token1 = generateAccessToken(testUserId);
      
      // Wait a bit to ensure different timestamp
      const delay = () => new Promise(resolve => setTimeout(resolve, 1000));
      return delay().then(() => {
        const token2 = generateAccessToken(testUserId);
        
        const decoded1 = decodeToken(token1);
        const decoded2 = decodeToken(token2);
        
        expect(decoded1.iat).not.toBe(decoded2.iat);
      });
    });
  });
});
