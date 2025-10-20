@echo off
echo ============================================
echo  ADHD Detection System - Quick Start
echo  Professional Frontend Application
echo ============================================
echo.

echo [1/3] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 18+ first.
    pause
    exit /b 1
)
echo.

echo [2/3] Starting Backend Server...
echo Please ensure your Python backend is running on http://localhost:5000
echo.
echo To start backend manually:
echo   cd backend
echo   python app.py
echo.

timeout /t 3

echo [3/3] Starting Frontend Development Server...
cd /d "%~dp0"
npm run dev

pause
