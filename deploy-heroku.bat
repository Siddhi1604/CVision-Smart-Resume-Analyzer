@echo off
echo ========================================
echo CVision Heroku Deployment Script
echo ========================================
echo.

echo Step 1: Checking Heroku CLI installation...
heroku --version
if %errorlevel% neq 0 (
    echo ERROR: Heroku CLI not found!
    echo Please install from: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)
echo Heroku CLI found!
echo.

echo Step 2: Login to Heroku...
heroku login
if %errorlevel% neq 0 (
    echo ERROR: Heroku login failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Deploying Backend...
cd backend
echo Creating backend app...
heroku create cvision-backend
echo Setting Python buildpack...
heroku buildpacks:set heroku/python -a cvision-backend
echo.
echo IMPORTANT: You need to set these environment variables:
echo heroku config:set OPENROUTER_API_KEY=your_key -a cvision-backend
echo heroku config:set EMAIL_PASSWORD=your_password -a cvision-backend
echo heroku config:set BACKEND_ALLOWED_ORIGINS=https://cvision-frontend.herokuapp.com -a cvision-backend
echo.
echo Press any key after setting environment variables...
pause
echo Deploying backend...
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
echo Backend deployed!
echo.

echo Step 4: Deploying Frontend...
cd ..\frontend
echo Creating frontend app...
heroku create cvision-frontend
echo Setting Node.js buildpack...
heroku buildpacks:set heroku/nodejs -a cvision-frontend
echo.
echo IMPORTANT: You need to set these environment variables:
echo heroku config:set REACT_APP_FIREBASE_API_KEY=your_key -a cvision-frontend
echo heroku config:set REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain -a cvision-frontend
echo heroku config:set REACT_APP_FIREBASE_PROJECT_ID=your_project_id -a cvision-frontend
echo heroku config:set REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket -a cvision-frontend
echo heroku config:set REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id -a cvision-frontend
echo heroku config:set REACT_APP_FIREBASE_APP_ID=your_app_id -a cvision-frontend
echo heroku config:set REACT_APP_API_URL=https://cvision-backend.herokuapp.com -a cvision-frontend
echo.
echo Press any key after setting environment variables...
pause
echo Deploying frontend...
git add .
git commit -m "Deploy frontend to Heroku"
git push heroku main
echo Frontend deployed!
echo.

echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your apps are now live at:
echo Frontend: https://cvision-frontend.herokuapp.com
echo Backend:  https://cvision-backend.herokuapp.com
echo.
echo Cost: $14/month (14+ months free with your $200 credit!)
echo.
pause
