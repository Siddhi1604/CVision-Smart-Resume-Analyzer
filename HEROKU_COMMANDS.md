# 🚀 CVision Heroku Deployment Commands

## Prerequisites
1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Create Heroku account**: https://heroku.com
3. **Get your API keys** (see Environment Variables section below)

## 📋 Step-by-Step Commands

### Step 1: Verify Heroku CLI
```bash
heroku --version
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Deploy Backend (FastAPI)
```bash
# Navigate to backend
cd backend

# Create backend app
heroku create cvision-backend

# Set Python buildpack
heroku buildpacks:set heroku/python -a cvision-backend

# Set environment variables (REPLACE WITH YOUR VALUES)
heroku config:set OPENROUTER_API_KEY=your_actual_openrouter_key -a cvision-backend
heroku config:set EMAIL_PASSWORD=your_actual_gmail_password -a cvision-backend
heroku config:set BACKEND_ALLOWED_ORIGINS=https://cvision-frontend.herokuapp.com -a cvision-backend

# Deploy backend
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

### Step 4: Deploy Frontend (React)
```bash
# Navigate to frontend
cd frontend

# Create frontend app
heroku create cvision-frontend

# Set Node.js buildpack
heroku buildpacks:set heroku/nodejs -a cvision-frontend

# Set environment variables (REPLACE WITH YOUR VALUES)
heroku config:set REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_PROJECT_ID=your_actual_project_id -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_APP_ID=your_actual_app_id -a cvision-frontend
heroku config:set REACT_APP_API_URL=https://cvision-backend.herokuapp.com -a cvision-frontend

# Deploy frontend
git add .
git commit -m "Deploy frontend to Heroku"
git push heroku main
```

## 🔑 Environment Variables You Need

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings → General
3. Scroll to "Your apps" → Web app config
4. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### OpenRouter API Key
1. Go to [OpenRouter](https://openrouter.ai)
2. Sign up and get your API key

### Gmail App Password
1. Enable 2-factor authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate password for "Mail"

## 🎯 Quick Copy-Paste Commands

### Backend (Run in `backend/` directory):
```bash
heroku create cvision-backend
heroku buildpacks:set heroku/python -a cvision-backend
heroku config:set OPENROUTER_API_KEY=YOUR_KEY -a cvision-backend
heroku config:set EMAIL_PASSWORD=YOUR_PASSWORD -a cvision-backend
heroku config:set BACKEND_ALLOWED_ORIGINS=https://cvision-frontend.herokuapp.com -a cvision-backend
git add . && git commit -m "Deploy backend" && git push heroku main
```

### Frontend (Run in `frontend/` directory):
```bash
heroku create cvision-frontend
heroku buildpacks:set heroku/nodejs -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_API_KEY=YOUR_KEY -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID -a cvision-frontend
heroku config:set REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID -a cvision-frontend
heroku config:set REACT_APP_API_URL=https://cvision-backend.herokuapp.com -a cvision-frontend
git add . && git commit -m "Deploy frontend" && git push heroku main
```

## 🌐 Your Live URLs
- **Frontend**: https://cvision-frontend.herokuapp.com
- **Backend API**: https://cvision-backend.herokuapp.com

## 💰 Cost
- **$7/month per app** = **$14/month total**
- **With your $200 credit** = **14+ months free!**

## 🔧 Troubleshooting
- Check logs: `heroku logs --tail -a cvision-backend`
- Check logs: `heroku logs --tail -a cvision-frontend`
- Verify environment variables: `heroku config -a cvision-backend`
- Verify environment variables: `heroku config -a cvision-frontend`

## 📁 Files Updated for Heroku
- ✅ `backend/Procfile` - FastAPI startup command
- ✅ `backend/runtime.txt` - Python 3.11.0
- ✅ `frontend/Procfile` - React build serving
- ✅ `frontend/package.json` - Added `serve` package and `heroku-postbuild` script
