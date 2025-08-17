# Setting Up Clerk Authentication

Your Trip Tools app is configured to use Clerk for authentication and cloud sync features. Follow these steps to enable the sign-in/sign-up buttons:

## Quick Setup (5 minutes)

### 1. Create a Clerk Account
- Go to [https://clerk.com](https://clerk.com)
- Sign up for a free account
- Verify your email

### 2. Create a New Application
- In your Clerk dashboard, click "Add application"
- Choose a name (e.g., "Trip Tools")
- Select the authentication methods you want (Email, Google, etc.)
- Click "Create application"

### 3. Get Your API Keys
- In your new application dashboard, click on "API Keys" in the sidebar
- Copy the **Publishable key** (starts with `pk_test_` for development)
- This key is safe to use in client-side code

### 4. Update Your Environment File
- Open `.env.local` in your project root
- Replace the `VITE_CLERK_PUBLISHABLE_KEY` value with your actual key:
  ```
  VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_long_key_here
  ```

### 5. Restart Development Server
- Stop your dev server (Ctrl+C)
- Run `npm run dev` again
- The sign-in/sign-up buttons should now appear in the header

## What You'll Get

Once configured, users will see:
- **Sign Up** and **Sign In** buttons in the header
- User profile button when signed in
- Cloud sync status indicator
- Automatic data synchronization across devices

## Troubleshooting

### Buttons Still Not Showing?
1. **Check your key**: Make sure it starts with `pk_test_` and is very long
2. **Restart dev server**: Environment variables only load on startup
3. **Check browser console**: Look for any Clerk-related errors
4. **Verify file**: Make sure `.env.local` is in the project root

### Key Format Example
```
# ✅ Correct format (much longer than shown):
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsubmV0JA45Z2ZlLWRjOTctNDBhNi1hODYzLTNmNzU5ZTg2ZjE5ZCQ...

# ❌ Incorrect format (too short):
VITE_CLERK_PUBLISHABLE_KEY=pk_test_short_key
```

### Need Help?
- Check the [Clerk Documentation](https://clerk.com/docs)
- Look at your browser's developer console for error messages
- Make sure you're using the **Publishable Key**, not the Secret Key

## Free Tier Limits
Clerk's free tier includes:
- Up to 10,000 monthly active users
- All authentication methods
- User management
- Perfect for personal projects and development

Your app will work perfectly without authentication (all features work offline), but signing in enables cloud sync across devices.
