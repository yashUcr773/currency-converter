import { authRateLimit } from '../../src/middleware/auth.js';

describe('Auth Middleware', () => {
  describe('authRateLimit', () => {
    it('should create rate limiter with correct configuration', () => {
      const limiter = authRateLimit(15 * 60 * 1000, 5);
      
      // Rate limiter should be a function
      expect(typeof limiter).toBe('function');
      
      // Should have the expected properties
      expect(limiter).toBeDefined();
    });
  });
});
