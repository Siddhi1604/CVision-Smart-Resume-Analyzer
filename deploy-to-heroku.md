# Heroku Deployment Guide for CVision Smart Resume Analyzer

## Prerequisites
1. **Install Heroku CLI manually:**
   - Go to: https://devcenter.heroku.com/articles/heroku-cli
   - Download and install the Windows installer
   - Restart your terminal after installation

2. **Create Heroku account:**
   - Sign up at https://heroku.com
   - Verify your account

## Files Created for Heroku Deployment

### Backend Files:
- ✅ `backend/Procfile` - Tells Heroku how to run the FastAPI app
- ✅ `backend/runtime.txt` - Specifies Python version

### Frontend Files:
- ✅ `frontend/Procfile` - Tells Heroku how to run the React app
- ✅ `frontend/package.json` - Updated with heroku-postbuild script

## Deployment Steps

### Step 1: Install Heroku CLI
1. Download from: https://devcenter.heroku.com/articles/heroku-cli
2. Run the installer
3. Restart your terminal
4. Verify: `heroku --version`

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Deploy Backend
```bash
# Navigate to backend directory
cd backend

# Create backend app
heroku create your-app-name-backend

# Set Python buildpack
heroku buildpacks:set heroku/python -a your-app-name-backend

# Add environment variables
heroku config:set OPENROUTER_API_KEY=your_openrouter_key -a your-app-name-backend
heroku config:set EMAIL_PASSWORD=your_gmail_password -a your-app-name-backend
heroku config:set BACKEND_ALLOWED_ORIGINS=https://your-frontend-app.herokuapp.com -a your-app-name-backend

# Deploy
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

### Step 4: Deploy Frontend
```bash
# Navigate to frontend directory
cd frontend

# Create frontend app
heroku create your-app-name-frontend

# Set Node.js buildpack
heroku buildpacks:set heroku/nodejs -a your-app-name-frontend

# Add environment variables
heroku config:set REACT_APP_FIREBASE_API_KEY=your_firebase_key -a your-app-name-frontend
heroku config:set REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com -a your-app-name-frontend
heroku config:set REACT_APP_FIREBASE_PROJECT_ID=your_project_id -a your-app-name-frontend
heroku config:set REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com -a your-app-name-frontend
heroku config:set REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id -a your-app-name-frontend
heroku config:set REACT_APP_FIREBASE_APP_ID=your_app_id -a your-app-name-frontend
heroku config:set REACT_APP_API_URL=https://your-app-name-backend.herokuapp.com -a your-app-name-frontend

# Deploy
git add .
git commit -m "Deploy frontend to Heroku"
git push heroku main
```

## Environment Variables Needed

### Backend (.env):
```
OPENROUTER_API_KEY=your_openrouter_api_key
EMAIL_PASSWORD=your_gmail_app_password
BACKEND_ALLOWED_ORIGINS=https://your-frontend-app.herokuapp.com
```

### Frontend (.env):
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=https://your-backend-app.herokuapp.com
```

## Cost with GitHub Student Pack
- **Basic Plan**: $7/month per app
- **Two apps total**: $14/month
- **With $200 credit**: 14+ months free!

## Troubleshooting
- If deployment fails, check logs: `heroku logs --tail -a your-app-name`
- Make sure all environment variables are set correctly
- Ensure your GitHub repository is up to date before deploying
