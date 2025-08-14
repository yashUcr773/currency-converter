import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test timeout
jest.setTimeout(30000);

// Database connection setup for tests
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-tools-test';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error.message);
    throw error;
  }
});

afterAll(async () => {
  // Clean up and close connection after all tests
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('✅ Test database disconnected');
  }
});

// Clean database before each test suite
beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});