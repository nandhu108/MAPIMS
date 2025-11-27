@echo off
echo ========================================
echo   MAPIMS Health Assessment System
echo   Starting Application...
echo ========================================
echo.

REM Set development environment
set FLASK_ENV=development

REM Try to find Python - check multiple locations
REM Priority: Check installed Python 3.12 first (skip broken local python.exe)
set PYTHON_CMD=

REM Check for Python 3.12 in ADMIN user location first (most reliable)
if exist "C:\Users\ADMIN\AppData\Local\Programs\Python\Python312\python.exe" (
    "C:\Users\ADMIN\AppData\Local\Programs\Python\Python312\python.exe" --version >nul 2>&1
    if %errorlevel% == 0 (
        "C:\Users\ADMIN\AppData\Local\Programs\Python\Python312\python.exe" -m pip --version >nul 2>&1
        if %errorlevel% == 0 (
            set PYTHON_CMD=C:\Users\ADMIN\AppData\Local\Programs\Python\Python312\python.exe
            goto :check_dependencies
        )
    )
)

REM Check for Python 3.12 in common installation location
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe" (
    "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe" --version >nul 2>&1
    if %errorlevel% == 0 (
        "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe" -m pip --version >nul 2>&1
        if %errorlevel% == 0 (
            set PYTHON_CMD=C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\python.exe
            goto :check_dependencies
        )
    )
)

REM Check Python launcher (py -3) - this should find installed Python
py -3 --version >nul 2>&1
if %errorlevel% == 0 (
    py -3 -m pip --version >nul 2>&1
    if %errorlevel% == 0 (
        set PYTHON_CMD=py -3
        goto :check_dependencies
    )
)

REM Check standard python command (but verify it's not the broken local one)
REM Change to a temp directory to avoid finding local python.exe
pushd %TEMP%
python --version >nul 2>&1
if %errorlevel% == 0 (
    python -m pip --version >nul 2>&1
    if %errorlevel% == 0 (
        set PYTHON_CMD=python
        popd
        goto :check_dependencies
    )
)
popd

echo ERROR: Python is not found!
echo Please install Python 3.12 or later.
echo Run install_python.bat to install Python automatically.
echo.
pause
exit /b 1

:check_dependencies
REM Verify Python and pip are working
echo Using Python: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.

REM Check if dependencies are installed
%PYTHON_CMD% -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    %PYTHON_CMD% -m pip install -r requirements.txt
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo.
        echo Troubleshooting:
        echo 1. Make sure you have internet connection
        echo 2. Try running as Administrator
        echo 3. Check if Python is properly installed
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo.
echo Starting Flask application...
echo Application will be available at: http://localhost:5000
echo Admin panel: http://localhost:5000/admin
echo.
echo Press Ctrl+C to stop the application
echo.

REM Run the application
%PYTHON_CMD% app.py

pause

