# Cloud Storage Setup Guide

This application now includes cloud storage capabilities for logged-in users, allowing data synchronization across devices.

## Features

- **Automatic Cloud Sync**: Data is automatically synchronized when users are logged in
- **Migration System**: Existing local storage data is automatically migrated on first load
- **Real-time Status**: Cloud sync status is displayed in the header
- **Conflict Resolution**: Smart merging of local and cloud data
- **Offline Support**: Full offline functionality with sync when connection is restored

## AWS DynamoDB Setup

### 1. Create DynamoDB Table

Create a table in AWS DynamoDB with the following configuration:

- **Table Name**: `ratevault-user-data` (or your preferred name)
- **Partition Key**: `userId` (String)
- **Sort Key**: `dataType` (String)

### 2. IAM Permissions

Your AWS credentials need the following DynamoDB permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT:table/ratevault-user-data"
    }
  ]
}
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_DYNAMODB_TABLE_NAME=ratevault-user-data

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## Development with DynamoDB Local

For local development, you can use DynamoDB Local:

1. Install DynamoDB Local:
```bash
npm install -g dynamodb-local
```

2. Start DynamoDB Local:
```bash
dynamodb-local
```

3. Add to your `.env.local`:
```bash
VITE_DYNAMODB_ENDPOINT=http://localhost:8000
```

## Data Structure

The cloud storage system stores the following data types:

- `userPreferences`: User settings and preferences
- `currencyData`: Currency conversion favorites and settings
- `timezoneData`: Timezone conversion settings
- `unitData`: Unit conversion settings
- `itineraryData`: Travel itinerary data

## Security Notes

- **Production**: Use IAM roles instead of access keys in production
- **Environment Variables**: Never commit `.env.local` to version control
- **CORS**: Configure appropriate CORS settings for your domain
- **Rate Limiting**: Consider implementing rate limiting for API calls

## Troubleshooting

### Common Issues

1. **"CloudFormation not configured"**: Check your AWS credentials and region
2. **"Access Denied"**: Verify IAM permissions for DynamoDB
3. **"Table not found"**: Ensure the DynamoDB table exists and the name matches
4. **Sync not working**: Check network connection and authentication status

### Debug Mode

Set `localStorage.debug = 'cloudsync'` in browser console to enable debug logging.
