#!/bin/bash

# EventFlow Setup Script
# This script sets up the project for development

echo "🚀 EventFlow Setup Script"
echo "========================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << EOF
GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_API_URL=http://localhost:5000
EOF
    echo "ℹ️  Created .env.local - please update with your API keys"
fi

# Check for .env (backend)
if [ ! -f ".env" ]; then
    echo "⚠️  .env (backend) not found. Creating template..."
    cat > .env << EOF
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890
GEMINI_API_KEY=your_gemini_api_key
EOF
    echo "ℹ️  Created .env - please update with your credentials"
fi

# Create public/uploads directory
mkdir -p public/uploads

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Update .env.local with your GEMINI_API_KEY"
echo "2. Update .env with your email and Twilio credentials (optional)"
echo "3. Run 'npm run dev:all' to start development"
echo ""
echo "📖 For more info, see DEPLOYMENT.md"
