/**
 * @jest-environment node
 * @jest-no-coverage
 */

import {
  generateOTP,
  generateSecureToken,
  hashString,
  generateRandomString,
  isValidEmail,
  isStrongPassword,
  sanitizeUserAgent,
  getClientIP,
  delay
} from '../../src/utils/helpers.js';

// Override the global setup for this test file
beforeAll(() => {
  // Mock environment variables for this test
  process.env.NODE_ENV = 'test';
});

describe('Helper Utils', () => {
  describe('generateOTP', () => {
    it('should generate OTP with default length of 6', () => {
      const otp = generateOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate OTP with custom length', () => {
      const otp = generateOTP(4);
      expect(otp).toHaveLength(4);
      expect(/^\d{4}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs on successive calls', () => {
      const otp1 = generateOTP();
      const otp2 = generateOTP();
      
      // While there's a small chance they could be the same, it's extremely unlikely
      expect(otp1).not.toBe(otp2);
    });

    it('should only contain digits', () => {
      const otp = generateOTP(10);
      expect(/^\d+$/.test(otp)).toBe(true);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate token with default length', () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(64); // 32 bytes = 64 hex characters
    });

    it('should generate token with custom length', () => {
      const token = generateSecureToken(16);
      expect(token).toHaveLength(32); // 16 bytes = 32 hex characters
    });

    it('should generate different tokens on successive calls', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      
      expect(token1).not.toBe(token2);
    });

    it('should only contain hexadecimal characters', () => {
      const token = generateSecureToken();
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });
  });

  describe('hashString', () => {
    it('should hash string using default algorithm (sha256)', () => {
      const input = 'test string';
      const hash = hashString(input);
      
      expect(hash).toHaveLength(64); // SHA256 produces 64 character hex string
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });

    it('should hash string using custom algorithm', () => {
      const input = 'test string';
      const hash = hashString(input, 'sha1');
      
      expect(hash).toHaveLength(40); // SHA1 produces 40 character hex string
    });

    it('should produce same hash for same input', () => {
      const input = 'test string';
      const hash1 = hashString(input);
      const hash2 = hashString(input);
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different inputs', () => {
      const hash1 = hashString('test1');
      const hash2 = hashString('test2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateRandomString', () => {
    it('should generate string with default length', () => {
      const str = generateRandomString();
      expect(str).toHaveLength(16);
    });

    it('should generate string with custom length', () => {
      const str = generateRandomString(10);
      expect(str).toHaveLength(10);
    });

    it('should generate different strings on successive calls', () => {
      const str1 = generateRandomString();
      const str2 = generateRandomString();
      
      expect(str1).not.toBe(str2);
    });

    it('should only contain hexadecimal characters', () => {
      const str = generateRandomString();
      expect(/^[0-9a-f]+$/.test(str)).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@sub.domain.com',
        'test_email@example.net'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid emails', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing.domain@.com',
        'spaces in@email.com',
        'test@',
        'test@@domain.com',
        'test@domain',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecure@2023',
        'Complex1$Password',
        'Valid123@Test'
      ];

      strongPasswords.forEach(password => {
        expect(isStrongPassword(password)).toBe(true);
      });
    });

    it('should return false for weak passwords', () => {
      const weakPasswords = [
        'short',           // Too short
        'nouppercase1@',   // No uppercase
        'NOLOWERCASE1@',   // No lowercase
        'NoNumbers@',      // No numbers
        'NoSpecialChar1',  // No special characters
        'weakpassword',    // Missing multiple requirements
        ''                 // Empty string
      ];

      weakPasswords.forEach(password => {
        expect(isStrongPassword(password)).toBe(false);
      });
    });
  });

  describe('sanitizeUserAgent', () => {
    it('should return the user agent if within limits', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
      expect(sanitizeUserAgent(userAgent)).toBe(userAgent);
    });

    it('should truncate long user agent strings', () => {
      const longUserAgent = 'A'.repeat(250);
      const sanitized = sanitizeUserAgent(longUserAgent);
      
      expect(sanitized).toHaveLength(200);
      expect(sanitized).toBe('A'.repeat(200));
    });

    it('should return "Unknown" for null or undefined user agent', () => {
      expect(sanitizeUserAgent(null)).toBe('Unknown');
      expect(sanitizeUserAgent(undefined)).toBe('Unknown');
    });

    it('should handle empty string user agent', () => {
      expect(sanitizeUserAgent('')).toBe('Unknown');
    });
  });

  describe('getClientIP', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1'
        }
      };

      expect(getClientIP(req)).toBe('192.168.1.1');
    });

    it('should extract IP from connection.remoteAddress', () => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.1.1'
        }
      };

      expect(getClientIP(req)).toBe('192.168.1.1');
    });

    it('should extract IP from socket.remoteAddress', () => {
      const req = {
        headers: {},
        socket: {
          remoteAddress: '192.168.1.1'
        }
      };

      expect(getClientIP(req)).toBe('192.168.1.1');
    });

    it('should return "unknown" if no IP found', () => {
      const req = {
        headers: {}
      };

      expect(getClientIP(req)).toBe('unknown');
    });

    it('should prioritize x-forwarded-for over other sources', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.1'
        },
        connection: {
          remoteAddress: '10.0.0.1'
        }
      };

      expect(getClientIP(req)).toBe('192.168.1.1');
    });
  });

  describe('delay', () => {
    it('should delay execution for specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      
      const elapsed = end - start;
      expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some variance
      expect(elapsed).toBeLessThan(150);
    });

    it('should return a promise', () => {
      const result = delay(1);
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
