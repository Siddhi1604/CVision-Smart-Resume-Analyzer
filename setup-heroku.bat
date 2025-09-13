@echo off
echo Setting up Heroku deployment for CVision Smart Resume Analyzer
echo.

echo Step 1: Installing Heroku CLI...
echo Please download and install Heroku CLI from: https://devcenter.heroku.com/articles/heroku-cli
echo After installation, restart this script.
pause

echo.
echo Step 2: Checking Heroku CLI installation...
heroku --version
if %errorlevel% neq 0 (
    echo Heroku CLI not found. Please install it first.
    pause
    exit /b 1
)

echo.
echo Step 3: Login to Heroku...
heroku login

echo.
echo Step 4: Ready to deploy!
echo.
echo Next steps:
echo 1. Navigate to backend directory: cd backend
echo 2. Create backend app: heroku create your-app-name-backend
echo 3. Set buildpack: heroku buildpacks:set heroku/python -a your-app-name-backend
echo 4. Add environment variables (see backend/env-template.txt)
echo 5. Deploy: git add . && git commit -m "Deploy backend" && git push heroku main
echo.
echo Then repeat for frontend in the frontend directory.
echo.
pause
