# Heroku Setup Script for CVision Smart Resume Analyzer
Write-Host "Setting up Heroku deployment for CVision Smart Resume Analyzer" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Installing Heroku CLI..." -ForegroundColor Yellow
Write-Host "Please download and install Heroku CLI from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Cyan
Write-Host "After installation, restart this script." -ForegroundColor Cyan
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "Step 2: Checking Heroku CLI installation..." -ForegroundColor Yellow
try {
    $herokuVersion = heroku --version
    Write-Host "Heroku CLI found: $herokuVersion" -ForegroundColor Green
} catch {
    Write-Host "Heroku CLI not found. Please install it first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Login to Heroku..." -ForegroundColor Yellow
heroku login

Write-Host ""
Write-Host "Step 4: Ready to deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Navigate to backend directory: cd backend" -ForegroundColor White
Write-Host "2. Create backend app: heroku create your-app-name-backend" -ForegroundColor White
Write-Host "3. Set buildpack: heroku buildpacks:set heroku/python -a your-app-name-backend" -ForegroundColor White
Write-Host "4. Add environment variables (see backend/env-template.txt)" -ForegroundColor White
Write-Host "5. Deploy: git add . && git commit -m 'Deploy backend' && git push heroku main" -ForegroundColor White
Write-Host ""
Write-Host "Then repeat for frontend in the frontend directory." -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
