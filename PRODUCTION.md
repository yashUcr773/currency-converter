# Production Deployment Guide

This guide covers deploying Trip Tools to production environments.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel CLI (for Vercel deployment)
- Environment variables configured

## Environment Setup

1. **Copy environment files:**
   ```bash
   cp .env.example .env.local
   cp .env.production.example .env.production.local
   ```

2. **Configure production variables in `.env.production.local`:**
   - `VITE_BACKEND_URL`: Your production backend URL
   - `VITE_CLERK_PUBLISHABLE_KEY`: Production Clerk key
   - `VITE_GOOGLE_ANALYTICS_ID`: GA4 tracking ID (optional)
   - Enable/disable features with feature flags

## Build Process

1. **Install dependencies:**
   ```bash
   npm ci
   ```

2. **Run security audit:**
   ```bash
   npm run security
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Test production build locally:**
   ```bash
   npm run preview
   ```

## Deployment to Vercel

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Automatic Deployment

The project includes GitHub Actions for automatic deployment:

1. **Set up GitHub Secrets:**
   - `VERCEL_TOKEN`: Your Vercel token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. **Push to main branch** triggers production deployment
3. **Pull requests** trigger preview deployments

## Performance Optimization

The production build includes:

- **Code splitting** with manual chunks
- **Tree shaking** to remove unused code
- **Terser minification** with console.log removal
- **CSS optimization** and code splitting
- **Asset optimization** with compression
- **Service Worker** for offline functionality

## Monitoring and Health Checks

### Health Check Endpoint

Visit `/health.html` to check application status:
- Service Worker functionality
- Local Storage availability
- API connectivity
- PWA installation status

### Performance Monitoring

The app includes built-in performance monitoring:
- Page load times
- Memory usage tracking
- Custom metrics
- Error reporting

### Error Monitoring

Production errors are automatically:
- Logged with full context
- Sent to monitoring services (when configured)
- Tracked with user agent and build information

## Security Features

### Headers
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer Policy
- Permissions Policy

### Data Protection
- All data encrypted in transit
- Local storage data obfuscation
- Secure authentication with Clerk
- Rate limiting on API endpoints

## Caching Strategy

### Static Assets
- **Long-term caching** (1 year) for assets with hashes
- **Immediate invalidation** for service worker
- **CDN optimization** through Vercel Edge Network

### Service Worker
- **Offline-first** strategy
- **Background sync** for data updates
- **Cache versioning** with automatic updates
- **Selective caching** for optimal performance

## Maintenance

### Regular Tasks

1. **Update dependencies:**
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor performance:**
   - Check bundle size: `npm run build:analyze`
   - Review error logs
   - Monitor Core Web Vitals

3. **Security audits:**
   ```bash
   npm run security
   ```

### Troubleshooting

**Build failures:**
- Clear cache: `npm run clean`
- Check TypeScript: `npm run type-check`
- Review lint errors: `npm run lint`

**Performance issues:**
- Analyze bundle: `npm run build:analyze`
- Check service worker cache
- Review network requests

**Deployment issues:**
- Verify environment variables
- Check Vercel logs
- Test health endpoint

## Scaling Considerations

### Traffic Management
- Vercel automatically scales
- Edge functions for API routes
- CDN for global distribution

### Database Scaling
- DynamoDB auto-scaling configured
- Connection pooling in backend
- Caching for frequent queries

### Monitoring Alerts
- Set up alerts for:
  - Error rate increases
  - Performance degradation
  - API response time spikes
  - Memory usage thresholds

## Backup and Recovery

### Data Backup
- DynamoDB automatic backups
- Point-in-time recovery enabled
- Cross-region replication (optional)

### Code Backup
- Git repository with full history
- Tagged releases for rollback
- Automatic deployment artifacts

## Support and Maintenance

For production support:
1. Check application health at `/health.html`
2. Review error logs in monitoring dashboard
3. Use built-in debug tools (development only)
4. Contact support with error reports and context
