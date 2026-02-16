# EventFlow - Setup and Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Git
- Google Gemini API Key (for AI-powered invitations)
- Twilio Account (optional, for SMS/WhatsApp)
- Gmail Account (for email sending)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Create `.env.local` for frontend:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   REACT_APP_API_URL=http://localhost:5000
   ```

   Create `.env` in root for backend:
   ```
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
   ```

3. **Run Development Server and Frontend**
   ```bash
   npm run dev:all
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📧 Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Use the app password in `EMAIL_PASSWORD`

## 💬 WhatsApp & SMS Configuration (Twilio)

1. Create a [Twilio Account](https://www.twilio.com/console)
2. Get your Account SID and Auth Token
3. Configure a Twilio Phone Number
4. Set up WhatsApp sandbox or purchase a WhatsApp business number
5. Update `.env` with your Twilio credentials

## 🌐 Deployment Options

### Option 1: Vercel + Render/Railway (Recommended)

**Frontend (Vercel)**
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `REACT_APP_API_URL` (your backend URL)
4. Deploy

**Backend (Render or Railway)**

**Using Render:**
1. Go to [render.com](https://render.com)
2. Create New Web Service
3. Connect GitHub repo
4. Configure:
   - Build: `npm install`
   - Start: `npm run server`
5. Add Environment Variables:
   - All variables from `.env.server`
6. Deploy

**Using Railway:**
1. Go to [railway.app](https://railway.app)
2. New Project → GitHub
3. Select your repo
4. Add environment variables
5. Deploy

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "server"]
```

### Option 3: Traditional Hosting (AWS, DigitalOcean, etc.)

1. SSH into server
2. Install Node.js and npm
3. Clone repository
4. Install dependencies
5. Configure PM2 or systemd for process management
6. Set up nginx as reverse proxy
7. Configure SSL with Let's Encrypt

## 🎨 Features

### Email Invitations
- AI-powered invitation generation using Google Gemini
- HTML-formatted emails
- Direct email sending via Nodemailer

### SMS & WhatsApp Invitations
- Send invitations via SMS
- Send invitations via WhatsApp
- Phone number validation
- Automatic message formatting

### Photo Management
- Upload event photos
- Lazy-loaded images for better performance
- Auto-deletion of old photos
- Max file size: 10MB

### Real-time Dashboard
- Live RSVP tracking
- Attendance statistics
- Response breakdown charts
- Event management

### Lazy Loading
- React component lazy loading
- Image lazy loading with IntersectionObserver
- Code splitting for optimal performance

## 📊 Performance Optimizations

- ✅ Code splitting (React, Router, Charts)
- ✅ Image lazy loading
- ✅ Component lazy loading
- ✅ Minified production builds
- ✅ CDN-friendly caching headers
- ✅ SEO meta tags
- ✅ Dark mode support

## 🔒 Security Best Practices

1. Never commit `.env` files
2. Use app-specific passwords for email
3. Rotate API keys regularly
4. Use HTTPS in production
5. Validate all user inputs on backend
6. Rate limit API endpoints
7. Use CORS properly

## 📝 API Endpoints

### Health Check
```
GET /api/health
```

### Image Upload
```
POST /api/upload
Body: FormData with 'image' file
```

### Send Email
```
POST /api/send-email
Body: { email, subject, body, eventName }
```

### Send SMS
```
POST /api/send-sms
Body: { phoneNumber, eventName, eventDate, rsvpLink }
```

### Send WhatsApp
```
POST /api/send-whatsapp
Body: { phoneNumber, eventName, eventDate, eventLocation, rsvpLink }
```

### Delete Image
```
DELETE /api/uploads/:filename
```

## 🐛 Troubleshooting

### Backend Won't Start
- Check `.env` file exists
- Verify Node.js version: `node --version`
- Clear node_modules: `rm -rf node_modules && npm install`

### Email Not Sending
- Verify Gmail app password is correct
- Enable "Less secure app access" if needed
- Check firewall/ISP blocks port 587

### WhatsApp Messages Not Sending
- Verify Twilio account is funded
- Check phone number format (+country_code)
- Ensure WhatsApp sandbox is active

### Images Not Uploading
- Check server disk space
- Verify uploads directory exists
- Check file permissions

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Twilio Docs](https://www.twilio.com/docs)
- [Google Gemini API](https://ai.google.dev)

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Include `.env.example` (with sensitive values removed)
