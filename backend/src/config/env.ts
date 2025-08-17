
import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'TT_AWS_ACCESS_KEY_ID',
  'TT_AWS_SECRET_ACCESS_KEY',
  'TT_AWS_REGION',
  'TT_DYNAMODB_TABLE_NAME'
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  aws: {
    accessKeyId: process.env.TT_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.TT_AWS_SECRET_ACCESS_KEY!,
    region: process.env.TT_AWS_REGION!,
    dynamodbTableName: process.env.TT_DYNAMODB_TABLE_NAME!,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};
