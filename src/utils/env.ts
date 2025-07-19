/**
 * Production-safe logging utilities
 */

const IS_PRODUCTION = import.meta.env.PROD;
const IS_DEVELOPMENT = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (IS_DEVELOPMENT) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (IS_DEVELOPMENT) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (IS_DEVELOPMENT) {
      console.debug(...args);
    }
  }
};

/**
 * Environment information
 */
export const env = {
  isDevelopment: IS_DEVELOPMENT,
  isProduction: IS_PRODUCTION,
  version: '1.0.0',
  buildDate: new Date().toISOString()
};

/**
 * Performance monitoring for production
 */
export const performance = {
  mark: (name: string) => {
    if (IS_DEVELOPMENT && window.performance) {
      window.performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (IS_DEVELOPMENT && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name, 'measure')[0];
        logger.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        logger.warn('Performance measurement failed:', error);
      }
    }
  }
};
