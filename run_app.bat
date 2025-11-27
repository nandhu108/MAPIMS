@echo off
echo ========================================
echo   MAPIMS Health Assessment System
echo   Starting Application...
echo ========================================
echo.

REM Set development environment
set FLASK_ENV=development

REM Check if Python is available
py -3 --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not found!
    echo Please install Python 3.12 or later.
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
py -3 -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    py -3 -m pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting Flask application...
echo Application will be available at: http://localhost:5000
echo Admin panel: http://localhost:5000/admin
echo.
echo Press Ctrl+C to stop the application
echo.

REM Run the application
py -3 app.py

pause

