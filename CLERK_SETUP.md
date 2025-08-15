# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for your currency converter app.

## 1. Create a Clerk Account

1. Visit [clerk.com](https://clerk.com/) and sign up for a free account
2. Click "Create Application" 
3. Choose your application name (e.g., "Trip Tools" or "Currency Converter")
4. Select your preferred sign-in options:
   - **Recommended**: Email, Google, GitHub
   - You can add more providers later

## 2. Get Your API Keys

1. After creating your application, go to the **API Keys** section in your dashboard
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Update your `.env.local` file:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

## 3. Configure Authentication Settings

### Application URLs (Development)
In your Clerk dashboard, go to **Domains** and add:
- **Frontend API URL**: `http://localhost:5173` (or your dev port)
- **Homepage URL**: `http://localhost:5173`

### Application URLs (Production)  
When deploying, add your production URLs:
- **Frontend API URL**: `https://yourdomain.com`
- **Homepage URL**: `https://yourdomain.com`

### Sign-in/Sign-up URLs
In the **Paths** section, configure:
- **Sign-in page**: `/sign-in`
- **Sign-up page**: `/sign-up` 
- **User profile page**: `/user-profile`
- **After sign-in URL**: `/`
- **After sign-up URL**: `/`

## 4. Customize Appearance (Optional)

1. Go to **Customization** > **Appearance**
2. Choose a theme that matches your app
3. Customize colors, fonts, and layouts
4. The components are already styled to match your app's theme

## 5. Configure Social Providers (Optional)

### Google OAuth
1. Go to **User & Authentication** > **Social Connections**
2. Enable Google
3. Add your Google OAuth client credentials

### GitHub OAuth  
1. Enable GitHub in Social Connections
2. Add your GitHub OAuth app credentials

### More Providers
Clerk supports 20+ providers including:
- Facebook, Twitter, LinkedIn
- Apple, Microsoft
- Discord, Twitch, and more

## 6. Set Up Webhooks (Optional)

For advanced features like user sync or cleanup:
1. Go to **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`

## 7. Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Click "Sign In" in the top-right corner
4. Test the sign-up and sign-in flows
5. Check the user profile and settings pages

## 8. Production Deployment

### Environment Variables
Make sure to set `VITE_CLERK_PUBLISHABLE_KEY` in your production environment.

### Allowed Origins
In production, add your domain to Clerk's **Allowed Origins** list.

### Security Settings
- Enable session timeout
- Configure password requirements
- Set up email verification
- Enable two-factor authentication (optional)

## Features Included

### ✅ Authentication Components
- Sign-in page with modal support
- Sign-up page with customizable fields
- User profile management
- User settings dashboard
- Protected route wrapper

### ✅ User Experience
- Seamless sign-in/sign-out
- Profile avatar and user button
- Settings page with account info
- Responsive design matching your app

### ✅ Data Management
- User preferences storage
- Automatic locale detection
- Metadata sync capabilities
- Local storage integration

### ✅ Security Features
- Email verification
- Secure session management
- CSRF protection
- Rate limiting

## Troubleshooting

### Common Issues

**"Invalid publishable key" error**
- Ensure your `.env.local` file is in the project root
- Restart your development server after adding the key
- Verify the key starts with `pk_test_` or `pk_live_`

**Authentication redirects not working**
- Check your Clerk dashboard URLs match your app
- Ensure redirect URLs are properly configured
- Clear browser cache and cookies

**Styling issues**
- The authentication components inherit your app's CSS variables
- Check that your Tailwind CSS is loading properly
- Verify your theme configuration

### Getting Help

- **Clerk Documentation**: [docs.clerk.com](https://docs.clerk.com/)
- **Community Support**: [Discord](https://discord.com/invite/b5rXHjAg7A)
- **GitHub Issues**: [Report bugs](https://github.com/clerk/javascript)

## Cost Information

- **Free Tier**: Up to 10,000 monthly active users
- **Pro Plan**: $25/month for up to 100,000 MAUs
- **Enterprise**: Custom pricing for larger applications

Perfect for personal projects, startups, and growing applications!
