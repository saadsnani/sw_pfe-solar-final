@echo off
REM 🚀 Quick Setup Script for Solar Dashboard (Windows)
REM Run this after cloning the repository

echo ================================
echo    Solar Dashboard Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

REM Create data directory if it doesn't exist
echo 📁 Creating data directory...
if not exist data mkdir data
type nul > data\.gitkeep

REM Create empty data files
echo [] > data\sensor-readings.json
echo [] > data\battery-temperature.json
echo [] > data\login-logs.json
echo [] > data\feedback.json

echo ✅ Data files created
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating .env.local file...
    (
        echo # Add your environment variables here
        echo NEXT_PUBLIC_API_URL=http://localhost:3000
        echo.
        echo # Email service ^(optional^)
        echo # EMAILJS_SERVICE_ID=your_service_id
        echo # EMAILJS_TEMPLATE_ID=your_template_id
        echo # EMAILJS_PUBLIC_KEY=your_public_key
    ) > .env.local
    echo ✅ .env.local created
)

echo.
echo ================================
echo    ✨ Setup Complete! ✨
echo ================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:3000
echo 3. Upload code to ESP32/Arduino
echo.
echo 📖 Read DEPLOYMENT.md for full guide
echo 🔧 Configure ESP32 WiFi credentials
echo.
pause
