@echo off
REM EventFlow Setup Script for Windows
REM This script sets up the project for development

echo.
echo 🚀 EventFlow Setup Script
echo ========================

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Check for .env.local
if not exist ".env.local" (
    echo.
    echo ⚠️  .env.local not found. Creating template...
    (
        echo GEMINI_API_KEY=your_gemini_api_key_here
        echo REACT_APP_API_URL=http://localhost:5000
    ) > .env.local
    echo ℹ️  Created .env.local - please update with your API keys
)

REM Check for .env (backend)
if not exist ".env" (
    echo.
    echo ⚠️  .env ^(backend^) not found. Creating template...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo SERVER_URL=http://localhost:5000
        echo EMAIL_USER=your_email@gmail.com
        echo EMAIL_PASSWORD=your_app_specific_password
        echo TWILIO_ACCOUNT_SID=your_twilio_account_sid
        echo TWILIO_AUTH_TOKEN=your_twilio_auth_token
        echo TWILIO_PHONE_NUMBER=+1234567890
        echo TWILIO_WHATSAPP_NUMBER=+1234567890
        echo GEMINI_API_KEY=your_gemini_api_key
    ) > .env
    echo ℹ️  Created .env - please update with your credentials
)

REM Create uploads directory
if not exist "public\uploads" (
    mkdir public\uploads
    echo ✅ Created public\uploads directory
)

echo.
echo ✅ Setup complete!
echo.
echo 📚 Next steps:
echo 1. Update .env.local with your GEMINI_API_KEY
echo 2. Update .env with your email and Twilio credentials ^(optional^)
echo 3. Run 'npm run dev:all' to start development
echo.
echo 📖 For more info, see DEPLOYMENT.md
echo.
pause
