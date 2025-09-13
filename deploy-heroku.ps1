# CVision Heroku Deployment Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "CVision Heroku Deployment Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Checking Heroku CLI installation..." -ForegroundColor Yellow
try {
    $herokuVersion = heroku --version
    Write-Host "Heroku CLI found: $herokuVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Heroku CLI not found!" -ForegroundColor Red
    Write-Host "Please install from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "Step 2: Login to Heroku..." -ForegroundColor Yellow
heroku login
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Heroku login failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "Step 3: Deploying Backend..." -ForegroundColor Yellow
Set-Location backend
Write-Host "Creating backend app..." -ForegroundColor Cyan
heroku create cvision-backend
Write-Host "Setting Python buildpack..." -ForegroundColor Cyan
heroku buildpacks:set heroku/python -a cvision-backend
Write-Host ""
Write-Host "IMPORTANT: You need to set these environment variables:" -ForegroundColor Red
Write-Host "heroku config:set OPENROUTER_API_KEY=your_key -a cvision-backend" -ForegroundColor White
Write-Host "heroku config:set EMAIL_PASSWORD=your_password -a cvision-backend" -ForegroundColor White
Write-Host "heroku config:set BACKEND_ALLOWED_ORIGINS=https://cvision-frontend.herokuapp.com -a cvision-backend" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter after setting environment variables"
Write-Host "Deploying backend..." -ForegroundColor Cyan
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
Write-Host "Backend deployed!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Deploying Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend
Write-Host "Creating frontend app..." -ForegroundColor Cyan
heroku create cvision-frontend
Write-Host "Setting Node.js buildpack..." -ForegroundColor Cyan
heroku buildpacks:set heroku/nodejs -a cvision-frontend
Write-Host ""
Write-Host "IMPORTANT: You need to set these environment variables:" -ForegroundColor Red
Write-Host "heroku config:set REACT_APP_FIREBASE_API_KEY=your_key -a cvision-frontend" -ForegroundColor White
Write-Host "heroku config:set REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain -a cvision-frontend" -ForegroundColor White
Write-Host "heroku config:set REACT_APP_FIREBASE_PROJECT_ID=your_project_id -a cvision-frontend" -ForegroundColor White
Write-Host "heroku config:set REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket -a cvision-frontend" -ForegroundColor White
Write-Host "heroku config:set REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id -a cvision-frontend" -ForegroundColor White
Write-Host "heroku config:set REACT_APP_FIREBASE_APP_ID=your_app_id -a cvision-frontend" -ForegroundColor White
Write-Host "heroku config:set REACT_APP_API_URL=https://cvision-backend.herokuapp.com -a cvision-frontend" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter after setting environment variables"
Write-Host "Deploying frontend..." -ForegroundColor Cyan
git add .
git commit -m "Deploy frontend to Heroku"
git push heroku main
Write-Host "Frontend deployed!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your apps are now live at:" -ForegroundColor Cyan
Write-Host "Frontend: https://cvision-frontend.herokuapp.com" -ForegroundColor White
Write-Host "Backend:  https://cvision-backend.herokuapp.com" -ForegroundColor White
Write-Host ""
Write-Host "Cost: `$14/month (14+ months free with your `$200 credit!)" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
