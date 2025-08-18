import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from './env';

const client = new DynamoDBClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
  maxAttempts: 3, // Retry up to 3 times
});

export const dynamodb = DynamoDBDocumentClient.from(client);
export const dynamodbClient = client;
export const tableName = config.aws.dynamodbTableName;

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};
