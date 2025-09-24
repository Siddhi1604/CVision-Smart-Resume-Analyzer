# Vercel Deployment Guide for CVision Smart Resume Analyzer

## Quick Start

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Your Project
```bash
# From your project root directory
vercel
```

### 4. Set Environment Variables
Go to your Vercel project dashboard → Settings → Environment Variables and add the variables from `vercel-env-template.txt`

### 5. Redeploy
```bash
vercel --prod
```

## What's Been Configured

✅ **vercel.json** - Full-stack configuration with proper routing
✅ **backend/api/index.py** - Vercel serverless function entry point  
✅ **backend/main.py** - Updated for Vercel compatibility
✅ **frontend/package.json** - Removed proxy, optimized for Vercel
✅ **Environment templates** - Ready-to-use environment variable list

## Your App Structure on Vercel

- **Frontend**: Served from `/` (React app)
- **Backend API**: Served from `/api/*` and direct endpoints
- **File Uploads**: Temporarily stored (consider cloud storage for production)
- **AI Analysis**: Works with OpenRouter API key

## Testing Your Deployment

After deployment, test these URLs:
- `https://your-app.vercel.app/` - Frontend
- `https://your-app.vercel.app/health` - Backend health check
- `https://your-app.vercel.app/api/jobs` - Job search API

## Troubleshooting

1. **Function timeout**: Increase `maxDuration` in vercel.json
2. **CORS errors**: Check environment variables and domain configuration
3. **File upload issues**: Consider using cloud storage (AWS S3, Cloudinary)
4. **Build failures**: Check Vercel function logs in dashboard

## Next Steps

1. Set up custom domain (optional)
2. Configure analytics
3. Set up CI/CD for automatic deployments
4. Consider cloud storage for file uploads
