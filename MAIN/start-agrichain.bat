@echo off
echo 🚀 Starting AgriChain Complete Setup
echo ====================================
echo.

REM Kill any existing node processes
taskkill /f /im node.exe >nul 2>&1

echo Starting AgriChain...
node start-agrichain.js

pause