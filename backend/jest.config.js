export default {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverage: false,
  testTimeout: 30000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true
};
