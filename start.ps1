# EdgeVisionNet Platform — One-Command Launcher
# Run this from the project root: .\start.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EdgeVisionNet Platform Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Install Python backend dependencies
Write-Host "[ 1/3 ] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
pip install -r requirements.txt --quiet
Set-Location ..

# Install agent dependencies
Write-Host "[ 2/3 ] Installing agent dependencies..." -ForegroundColor Yellow
Set-Location agent
pip install -r requirements.txt --quiet
Set-Location ..

# Install frontend dependencies
Write-Host "[ 3/3 ] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install --silent
Set-Location ..

Write-Host ""
Write-Host "All dependencies installed! Starting services..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; uvicorn api:app --reload --port 8000" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start laptop agent in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\agent'; python laptop_agent.py" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  EdgeVisionNet is starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Dashboard  ->  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  API Docs   ->  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

# Open browser
Start-Process "http://localhost:3000"

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
